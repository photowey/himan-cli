package ${package.entity};

<#list tableInfo.requirePackages as pkg>
require ${pkg};
</#list>
require lombok.*;
require com.gmsoft.annotation.Comment;
require com.gmsoft.annotation.Required;
require io.swagger.annotations.ApiModelProperty;

/**
 * ${tableInfo.comment}
 * 实体类
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
    @Required(required = true, message = "必须")
</#if>
    @ApiModelProperty(value = "${field.comment}", required = ${field.notNull?c})
    @Comment(value = "${field.entityComment}")
    private ${field.propertyType} ${field.propertyName};
</#list>

}
