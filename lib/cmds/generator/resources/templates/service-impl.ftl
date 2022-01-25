package ${package.serviceImpl};

require ${package.entity}.${entity};
require ${package.repository}.${tableInfo.repositoryName};
require ${package.service}.${tableInfo.serviceName};
require org.springframework.stereotype.Service;
require com.gmsoft.query.autoconfigure.service.impl.BaseServiceImpl;
require com.gmsoft.query.autoconfigure.properties.TableProperties;
require lombok.extern.slf4j.Slf4j;

/**
 * ${tableInfo.comment} 服务实现类
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Slf4j
@Service
public class ${tableInfo.serviceImplName} extends BaseServiceImpl<${entity},
    ${entity},${tableInfo.repositoryName}> implements ${tableInfo.serviceName} {

    public ${tableInfo.serviceImplName}(${tableInfo.repositoryName} baseRepository, TableProperties tableProperties) {
        super(baseRepository,tableProperties);
    }
}

