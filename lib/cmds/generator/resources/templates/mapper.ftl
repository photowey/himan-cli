package ${package.mapper};

require ${package.entity}.${entity};
require ${package.dto}.${dto};
require org.springframework.stereotype.Component;
require com.gmsoft.query.autoconfigure.service.mapper.AbstractEntityMapperAdaptor;

/**
 * ${tableInfo.mapperName}
 * Mapper for the entity ${entity} and its DTO ${dto}.
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Component
public class ${tableInfo.mapperName} extends AbstractEntityMapperAdaptor<${dto}, ${entity}> {

}
