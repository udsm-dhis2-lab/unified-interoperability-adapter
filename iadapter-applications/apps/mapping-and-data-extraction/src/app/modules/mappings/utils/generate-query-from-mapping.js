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
        query += `LEFT JOIN child_health_flat ch ON ch.encounter_id = en.encounter_id \n`;
    }

    if (mapping?.mapping?.params && !!mapping.mapping.params.find((param) => param.childGender)) {
        query += `LEFT JOIN postnatal_birth_details_flat pbd ON pbd.encounter_id = en.encounter_id \n`;
    }

    if (mapping?.mapping?.params && !!mapping.mapping.params.find((param) => param.isAlive)) {
        query += `LEFT JOIN outcome_details_flat ot ON ot.encounter_id = en.encounter_id \n`;
    }

    if (joins.size > 0) {
        query += `${Array.from(joins).join('\n')}\n`;
    }

    conditions.push(
        loincOrderCodes.length > 0
            ? `drep.effective_datetime BETWEEN '#{startDate} 00:00:00' AND '#{endDate} 23:59:59'`
            : `en.period_start BETWEEN '#{startDate} 00:00:00' AND '#{endDate} 23:59:59'`,
    );

    if (conditions.length > 0) {
        query += `WHERE ${conditions.join(' AND ')}\n`;
    }

    query = buildGroupByClause(query, icdCodes, mapping);

    return query;
};

const buildSelectPart = (query, mapping, useSum) => {
    const hasGender = !!mapping.mapping.params.find((param) => param.gender);
    const hasAgeGroup = !!mapping.mapping.params.find(
        (param) => param.ageType && param.startAge && param.endAge,
    );

    // If no params or empty params, handle the case differently
    if (!mapping.mapping.params || mapping.mapping.params.length === 0) {
        query += ` ${useSum ? 'SUM' : 'COUNT'}(DISTINCT en.encounter_id) AS \"total\" \n`;
        return query;
    }

    const filteredParams = mapping.mapping.params.filter(param => {
        const hasParamGender = !!param.gender;
        const hasParamAgeGroup =
            param.ageType && param.startAge !== undefined && param.startAge !== null && param.endAge;
        const hasMotherAgeGroup =
            param.motherStartAge !== undefined &&
            param.motherStartAge !== null &&
            param.motherEndAge !== undefined &&
            param.motherEndAge !== null;
        const hasServiceLocation = !!param.serviceLocation;
        const hasIsAliveStatus = !!param.isAlive;
        const hasChildGender = !!param.childGender;
        return hasParamGender || hasParamAgeGroup || hasMotherAgeGroup || hasServiceLocation || hasIsAliveStatus || hasChildGender;
    });

    filteredParams.forEach((param, index) => {
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
        const hasIsAliveStatus = !!param.isAlive;
        const hasChildGender = !!param.childGender;

        // Use SUM or COUNT based on useSum flag
        const countExpression = hasChildGender ? 'COUNT(*)' : 'COUNT(DISTINCT en.encounter_id)';
        query += ` ${useSum ? 'SUM' : countExpression} `;

        // Add filter conditions if needed
        if (hasParamGender || hasParamAgeGroup || hasMotherAgeGroup || hasServiceLocation || hasChildGender) {
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

            if (hasIsAliveStatus) {
                filterConditions.push(`ot.is_alive = ${param.isAlive === 'isNotALive' ? 'FALSE' : 'TRUE'}`);
            }

            if (hasChildGender) {
                filterConditions.push(`pbd.ext_gender = '${param.childGender === 'M' ? 'Male' : 'Female'}'`);
            }

            if (hasParamAgeGroup) {
                const ageInterval =
                    ageType.toLowerCase() === 'years'
                        ? 'YEAR'
                        : ageType.toLowerCase() === 'months'
                            ? 'MONTH'
                            : 'DAY';

                if (endAge === startAge) {
                    // This handles cases like "age is 5 years"
                    filterConditions.push(`pt.birth_date > (CURRENT_DATE - INTERVAL '${Number(startAge) + 1} ${ageInterval}') AND pt.birth_date <= (CURRENT_DATE - INTERVAL '${startAge} ${ageInterval}')`);
                } else {
                    // This handles age ranges like "10-14 years"
                    filterConditions.push(
                        `pt.birth_date > (CURRENT_DATE - INTERVAL '${Number(endAge) + 1} ${ageInterval}') AND pt.birth_date <= (CURRENT_DATE - INTERVAL '${startAge} ${ageInterval}')`
                    );
                }
            }
            query += filterConditions.join(' AND ');
            query += `)`;
        }

        query += ` AS \"${co}\"${index < filteredParams.length - 1 ? ',' : ''} \n`;
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
        query += `RIGHT JOIN condition_flat cond ON en.encounter_id = cond.encounter_id \n`;
        query += `AND cond.code IN ('${icdCodes.join("\',\'")}') \n`;
    }

    if (loincOrderCodes.length > 0) {
        query += `RIGHT JOIN diagnosticreport_flat drep ON en.encounter_id = drep.encounter_id \n`;
        query += `AND drep.code IN ('${loincOrderCodes.join("\',\'")}') \n`;
    }

    return query;
};

const getValue = (query) => {
    if (!query?.value == null) return null;
    return Array.isArray(query.value) ? query.value[0] : query.value;
};

const buildAdditionalConditions = (mapping) => {
    let joins = new Set();
    let conditions = [];

    // Process additional query conditions
    if (mapping.mapping.queries && mapping.mapping.queries.length > 0) {
        const hasMotherAgeGroup = !!mapping.mapping.params.find(
            (param) => param.motherStartAge,
        );
        const hasServiceLocation = !!mapping.mapping.params.find(
            (param) => param.serviceLocation,
        );
        const hasIsAliveStatus = !!mapping.mapping.params.find(
            (param) => param.isAlive,
        );
        const hasChildGender = !!mapping.mapping.params.find(
            (param) => param.childGender,
        );

        mapping.mapping.queries.forEach((queryItem) => {
            const leftSide = getValue(queryItem.leftSideQuery);
            const operator = queryItem.operator;
            const rightSide = getValue(queryItem.rightSideQuery);

            if (leftSide && operator) {
                // Handle left side of the condition
                let leftField;
                if (leftSide.table && leftSide.code) {
                    // Use the correct alias if the join is already handled by a parameter
                    if (leftSide.table === 'encounter_flat') {
                        leftField = `en.${leftSide.code}`;
                    } else if (
                        (hasMotherAgeGroup || hasServiceLocation) &&
                        leftSide.table === 'child_health_flat'
                    ) {
                        leftField = `ch.${leftSide.code}`;
                    } else if (
                        hasIsAliveStatus &&
                        leftSide.table === 'outcome_details_flat'
                    ) {
                        leftField = `ot.${leftSide.code}`;
                    } else if (
                        hasChildGender &&
                        leftSide.table === 'postnatal_birth_details_flat'
                    ) {
                        leftField = `pbd.${leftSide.code}`;
                    } else {
                        leftField = `${leftSide.table}.${leftSide.code}`;
                    }
                } else {
                    leftField = leftSide.code;
                }

                // Only add join if table is not encounter_flat and not already handled by a param
                if (
                    leftSide.table &&
                    leftSide.table !== 'encounter_flat' &&
                    !((hasMotherAgeGroup || hasServiceLocation) && leftSide.table === 'child_health_flat') &&
                    !(hasIsAliveStatus && leftSide.table === 'outcome_details_flat') &&
                    !(hasChildGender && leftSide.table === 'postnatal_birth_details_flat')
                ) {
                    joins.add(
                        `LEFT JOIN ${leftSide.table} ON ${leftSide.table}.encounter_id = en.encounter_id`,
                    );
                }

                // Handle right side of the condition
                let rightValue;
                if (queryItem.rightSideQuery?.type === 'tableField' && rightSide) {
                    if (rightSide.table && rightSide.code) {
                        // Use the correct alias if the join is already handled by a parameter
                        if (rightSide.table === 'encounter_flat') {
                            rightValue = `en.${rightSide.code}`;
                        } else if (
                            (hasMotherAgeGroup || hasServiceLocation) &&
                            rightSide.table === 'child_health_flat'
                        ) {
                            rightValue = `ch.${rightSide.code}`;
                        } else if (
                            hasIsAliveStatus &&
                            rightSide.table === 'outcome_details_flat'
                        ) {
                            rightValue = `ot.${rightSide.code}`;
                        } else if (
                            hasChildGender &&
                            rightSide.table === 'postnatal_birth_details_flat'
                        ) {
                            rightValue = `pbd.${rightSide.code}`;
                        } else {
                            rightValue = `${rightSide.table}.${rightSide.code}`;
                        }
                    } else {
                        rightValue = rightSide.code;
                    }

                    // Only add join if table is not encounter_flat and not already added
                    if (
                        rightSide.table &&
                        rightSide.table !== 'encounter_flat' &&
                        !((hasMotherAgeGroup || hasServiceLocation) && rightSide.table === 'child_health_flat') &&
                        !(hasIsAliveStatus && rightSide.table === 'outcome_details_flat') &&
                        !(hasChildGender && rightSide.table === 'postnatal_birth_details_flat') &&
                        !joins.has(
                            `LEFT JOIN ${rightSide.table} ON ${rightSide.table}.encounter_id = en.encounter_id`,
                        )
                    ) {
                        joins.add(
                            `LEFT JOIN ${rightSide.table} ON ${rightSide.table}.encounter_id = en.encounter_id`,
                        );
                    }
                } else if (queryItem.rightSideQuery?.type === 'primitiveValue') {
                    if (typeof rightSide === 'string') {
                        if (operator === 'IN' || operator === 'NOT IN') {
                            rightValue = rightSide;
                        } else {
                            rightValue = `'${rightSide}'`;
                        }
                    } else if (typeof rightSide === 'number') {
                        rightValue = rightSide;
                    } else if (typeof rightSide === 'boolean') {
                        rightValue = rightSide ? 'TRUE' : 'FALSE';
                    }
                }

                // Add condition based on available values
                if (leftField && operator && rightValue !== undefined) {
                    conditions.push(`${leftField} ${operator} ${rightValue}`);
                } else if (leftField && operator) {
                    conditions.push(`${leftField} ${operator}`);
                }
            }
        });
    }

    // Add visit conditions
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

    // Always group by organization_id
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