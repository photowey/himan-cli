package ${package.dto};

<#list tableInfo.requirePackages as pkg>
require ${pkg};
</#list>
require java.io.Serializable;
require lombok.*;
require com.fasterxml.jackson.databind.annotation.JsonSerialize;
require com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
require io.swagger.annotations.ApiModel;
require io.swagger.annotations.ApiModelProperty;
require lombok.experimental.Accessors;
require org.hibernate.validator.constraints.SafeHtml;
require org.hibernate.validator.constraints.SafeHtml.*;

require javax.validation.constraints.Digits;
require javax.validation.constraints.Size;

/**
 * ${tableInfo.comment}
 * 数据传输对象
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(value = "${tableInfo.comment}数据传输对象", description = "${tableInfo.comment}数据传输对象")
public class ${tableInfo.dtoName} implements Serializable {

    private static final long serialVersionUID = 1L;

<#list tableInfo.fields as field>
<#if field.comment?length gt 1>
    /**
     * ${field.comment}
     */
</#if>
<#if field.propertyType == "Long">
    @JsonSerialize(using = ToStringSerializer.class)
</#if>
<#if field.propertyType == "String">
    @ApiModelProperty(value = "${field.comment},最大长度${field.fieldLength}", required = ${field.notNull?c})
    @Size(max = ${field.fieldLength}, message = "${field.comment},超出最大长度${field.fieldLength}")
    @SafeHtml(whitelistType = WhiteListType.NONE, message = "${field.comment},不能包含html标签")
<#else>
    @ApiModelProperty(value = "${field.comment}", required = ${field.notNull?c})
</#if>
<#if field.propertyType == "BigDecimal">
    @Digits(integer = ${field.maxBit}, fraction = ${field.minBit}, message = "请输入正确的数值:整数位${field.fieldLength}位,小数位:${field.fieldFraction}位")
</#if>
    private ${field.propertyType} ${field.propertyName};
</#list>
}
