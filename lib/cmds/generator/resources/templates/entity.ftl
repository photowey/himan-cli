package ${package.entity};

<#list tableInfo.importPackages as pkg>
import ${pkg};
</#list>
import lombok.*;
import io.swagger.annotations.ApiModelProperty;

/**
 * {@code ${tableInfo.entityName}}
 * ${tableInfo.comment} 实体类
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ${tableInfo.entityName} {

<#list tableInfo.fields as field>
<#if field.comment?length gt 1>
    /**
     * ${field.comment}
     */
</#if>
<#if field.notNull == true>
    // @Required(required = true, message = "必须")
</#if>
    @ApiModelProperty(value = "${field.comment}", required = ${field.notNull?c})
    private ${field.propertyType} ${field.propertyName};
</#list>

}
