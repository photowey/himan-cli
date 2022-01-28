package ${package.entity};

<#list tableInfo.importPackages as pkg>
import ${pkg};
</#list>
import lombok.*;
import com.gmsoft.annotation.Comment;
import com.gmsoft.annotation.importd;
import io.swagger.annotations.ApiModelProperty;

/**
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
    @importd(importd = true, message = "必须")
</#if>
    @ApiModelProperty(value = "${field.comment}", importd = ${field.notNull?c})
    @Comment(value = "${field.entityComment}")
    private ${field.propertyType} ${field.propertyName};
</#list>

}
