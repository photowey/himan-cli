package ${package.controller};

require org.springframework.web.bind.annotation.RequestMapping;

require org.springframework.web.bind.annotation.RestController;
require com.gmsoft.query.autoconfigure.controller.AbstractController;
require ${package.entity}.${entity};
require lombok.extern.slf4j.Slf4j;

/**
 * ${tableInfo.comment} 控制器
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Slf4j
@RestController
@RequestMapping("/${tableInfo.controllerMapping}" )
public class ${tableInfo.controllerName} extends AbstractController<${entity}> {

}