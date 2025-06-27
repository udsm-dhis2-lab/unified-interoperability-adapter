const buildQuery = (mapping, useSum) => {
    let query = `SELECT en.organization_id,\n`;
    const dataElementId = mapping.mapping.dataElement?.id ?? '';
    query += `  '${dataElementId}' AS \"${dataElementId}\",\n`;

    query = buildSelectPart(query, mapping, useSum);

    const { icdCodes, loincOrderCodes, loincObsCodes } =
        extractCodeMappings(mapping);

    query += ` FROM encounter_flat en \n`;
    query = buildJoins(query, icdCodes, loincOrderCodes);

    const { joins, conditions } = buildAdditionalConditions(mapping);

    query += `LEFT JOIN patient_flat pt ON pt.identifier_value = en.patient_id \n `;

    if (mapping?.mapping?.params && (!!mapping.mapping.params.find((param) => param.motherStartAge) || !!mapping.mapping.params.find((param) => param.serviceLocation))) {
        query += `LEFT JOIN child_health_flat ch ON ch.encounter_id = en.identifier_value \n`;
    }

    if (joins.size > 0) {
        query += `${Array.from(joins).join('\n')}\n`;
    }

    conditions.push(
        loincOrderCodes.length > 0
            ? `drep.effective_datetime BETWEEN '#{startDate}' AND '#{endDate}'`
            : `en.period_start BETWEEN '#{startDate}' AND '#{endDate}'`,
    );

    if (conditions.length > 0) {
        query += `WHERE ${conditions.join(' AND ')}\n`;
    }

    query = buildGroupByClause(query, icdCodes, mapping);

    return query;
};

const buildSelectPart = (query, mapping, useSum) => {
    if (!mapping.mapping.params || mapping.mapping.params.length === 0) {
        query += ` ${useSum ? 'SUM' : 'COUNT'}(*) AS \"total\" \n`;
        return query;
    }

    mapping.mapping.params.forEach((param, index) => {
        const gender = param.gender;
        const co = param.co;
        const ageType = param.ageType;
        const startAge = param.startAge;
        const endAge = param.endAge;
        const hasParamGender = !!gender;
        const hasParamAgeGroup =
            ageType && startAge !== undefined && startAge !== null && endAge;

        const motherStartAge = param.motherStartAge;
        const motherEndAge = param.motherEndAge;

        const hasMotherAgeGroup =
            motherStartAge !== undefined &&
            motherStartAge !== null &&
            motherEndAge !== undefined &&
            motherEndAge !== null;

        const hasServiceLocation = !!param.serviceLocation;

        query += ` ${useSum ? 'SUM' : 'COUNT'}(*) `;

        if (hasParamGender || hasParamAgeGroup || hasMotherAgeGroup || hasServiceLocation) {
            query += ` FILTER ( WHERE `;
            const filterConditions = [];

            if (hasParamGender) {
                filterConditions.push(`pt.gender='${gender === 'M' || gender === 'ME' || gender.toLowerCase() === 'male' ? 'male' : 'female'}'`);
            }

            if (hasMotherAgeGroup) {
                filterConditions.push(`ch.mother_age BETWEEN ${motherStartAge} AND ${motherEndAge}`);
            }

            if (hasServiceLocation) {
                filterConditions.push(`ch.service_location = '${param.serviceLocation}'`);
            }

            if (hasParamAgeGroup) {
                const ageInterval =
                    ageType.toLowerCase() === 'years'
                        ? 'YEAR'
                        : ageType.toLowerCase() === 'months'
                            ? 'MONTH'
                            : 'DAY';

                if (endAge === startAge) {
                    filterConditions.push(`pt.birth_date BETWEEN ('#{endDate}'::date - INTERVAL '${startAge} ${ageInterval}') AND '#{endDate}'::date`);
                } else {
                    filterConditions.push(
                        `pt.birth_date BETWEEN ('#{endDate}'::date - INTERVAL '${endAge} ${ageInterval}') ` +
                        `AND ('#{endDate}'::date - INTERVAL '${startAge} ${ageInterval}')`
                    );
                }
            }
            query += filterConditions.join(' AND ');
            query += `)`;
        }

        query += ` AS \"${co}\"${index < mapping.mapping.params.length - 1 ? ',' : ''} \n`;
    });

    return query;
};

const extractCodeMappings = (mapping) => {
    let icdCodes = [];
    let loincOrderCodes = [];
    let loincObsCodes = [];

    if (mapping.mapping.icdMappings && mapping.mapping.icdMappings.length > 0) {
        icdCodes = mapping.mapping.icdMappings.map((icdMapping) => icdMapping.code);
    }

    if (
        mapping.mapping.loincMappings &&
        mapping.mapping.loincMappings.length > 0
    ) {
        loincOrderCodes = mapping.mapping.loincMappings.map(
            (mappingItem) => mappingItem.code,
        );
    }

    if (
        mapping.mapping.loincObsMappings &&
        mapping.mapping.loincObsMappings.length > 0
    ) {
        loincObsCodes = mapping.mapping.loincObsMappings.map(
            (mappingItem) => mappingItem.code,
        );
    }

    return { icdCodes, loincOrderCodes, loincObsCodes };
};

const buildJoins = (query, icdCodes, loincOrderCodes) => {
    if (icdCodes && icdCodes.length > 0) {
        query += `RIGHT JOIN condition_flat cond ON en.id = cond.encounter_id \n`;
        query += `AND cond.code IN ('${icdCodes.join("\',\'")}') \n`;
    }

    if (loincOrderCodes.length > 0) {
        query += `RIGHT JOIN diagnosticreport_flat drep ON en.id = drep.encounter_id \n`;
        query += `AND drep.code IN ('${loincOrderCodes.join("\',\'")}') \n`;
    }

    return query;
};

const getValue = (query) => {
    if (!query?.value) return null;
    return Array.isArray(query.value) ? query.value[0] : query.value;
};

const buildAdditionalConditions = (mapping) => {
    let joins = new Set();
    let conditions = [];

    if (mapping.mapping.queries && mapping.mapping.queries.length > 0) {
        const hasMotherAgeGroup = !!mapping.mapping.params.find((param) => param.motherStartAge);
        const hasServiceLocation = !!mapping.mapping.params.find((param) => param.serviceLocation);
        mapping.mapping.queries.forEach((queryItem) => {
            const leftSide = getValue(queryItem.leftSideQuery);
            const operator = queryItem.operator;
            const rightSide = getValue(queryItem.rightSideQuery);

            if (leftSide && operator) {
                let leftField;
                if (leftSide.table && leftSide.code) {
                    leftField =
                        leftSide.table === 'encounter_flat'
                            ? `en.${leftSide.code}` : (hasMotherAgeGroup || hasServiceLocation) ? `ch.${leftSide.code}`
                                : `${leftSide.table}.${leftSide.code}`;
                } else {
                    leftField = leftSide.code;
                }

                if (leftSide.table && leftSide.table !== 'encounter_flat' && !(hasMotherAgeGroup || hasServiceLocation)) {
                    joins.add(
                        `LEFT JOIN ${leftSide.table} ON ${leftSide.table}.encounter_id = en.identifier_value`,
                    );
                }

                let rightValue;
                if (queryItem.rightSideQuery?.type === 'tableField' && rightSide) {
                    if (rightSide.table && rightSide.code) {
                        rightValue =
                            rightSide.table === 'encounter_flat'
                                ? `en.${rightSide.code}` : (hasMotherAgeGroup || hasServiceLocation) ? `ch.${rightSide.code}`
                                    : `${rightSide.table}.${rightSide.code}`;
                    } else {
                        rightValue = rightSide.code;
                    }

                    if (
                        rightSide.table &&
                        rightSide.table !== 'encounter_flat' && !(hasMotherAgeGroup || hasServiceLocation) &&
                        !joins.has(
                            `LEFT JOIN ${rightSide.table} ON ${rightSide.table}.encounter_id = en.identifier_value`,
                        )
                    ) {
                        joins.add(
                            `LEFT JOIN ${rightSide.table} ON ${rightSide.table}.encounter_id = en.identifier_value`,
                        );
                    }
                } else if (queryItem.rightSideQuery?.type === 'primitiveValue') {
                    if (typeof rightSide === 'string') {
                        rightValue = `'${rightSide}'`;
                    } else if (typeof rightSide === 'number') {
                        rightValue = rightSide;
                    } else if (typeof rightSide === 'boolean') {
                        rightValue = rightSide ? 'TRUE' : 'FALSE';
                    }
                }

                if (leftField && operator && rightValue !== undefined) {
                    conditions.push(`${leftField} ${operator} ${rightValue}`);
                } else if (leftField && operator) {
                    conditions.push(`${leftField} ${operator}`);
                }
            }
        });
    }

    if (mapping.mapping.newVisit) {
        conditions.push(`en.new_visit = TRUE`);
    }

    if (mapping.mapping.newThisYear) {
        conditions.push(`en.new_this_year = TRUE`);
    }

    return { joins, conditions };
};

const buildGroupByClause = (query, icdCodes, mapping) => {
    query += ` GROUP BY `;

    let groupByClauses = [];

    if (icdCodes && icdCodes.length > 0) {
        groupByClauses.push(`cond.code`);
    }

    const hasGender = !!mapping.mapping.params.find((param) => param.gender);
    if (hasGender) {
        groupByClauses.push(`pt.gender`);
    }

    groupByClauses.push(`en.organization_id`);

    query += groupByClauses.join(', ') + `;`;

    return query;
};


/**
 * Generates a SQL query from a mapping object.
 * @param {object} mapping - The mapping object that comes from the UI.
 * @returns {string} The generated SQL query.
 */
const generateQueryFromMapping = (mapping) => {
    
    const useSum = mapping?.mapping?.useSum ?? false;

    const query = buildQuery(mapping, useSum);
    return query;
};

export default generateQueryFromMapping;