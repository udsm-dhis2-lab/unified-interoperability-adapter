package com.Adapter.icare.Controllers;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Adapter.icare.Domains.Datasource;
import com.Adapter.icare.Services.DatasourceService;

@RestController
@RequestMapping("/api/v1/datasource")
public class DatasourceController {

    private final DatasourceService datasourceService;

    public DatasourceController(DatasourceService datasourceService) {
        this.datasourceService = datasourceService;
    }

    @GetMapping
    public List<Datasource> getDatasources() {
        return datasourceService.getDatasources();
    }

    @GetMapping("/status")
    public String getStatus() {
        return "OK";
    }

    @PostMapping
    public Datasource addDatasource(@RequestBody Datasource datasource) {
        return datasourceService.AddNewDataSource(datasource);
    }

    @DeleteMapping("/{datasourceId}")
    public void deleteDatasource(@PathVariable("datasourceId") Long datasourceId) {
        datasourceService.deleteDatasource(datasourceId);

    }

    @PutMapping
    public Datasource updateDatasource(@RequestBody Datasource datasource) {
        return datasourceService.updateDatasource(datasource);
    }
}
