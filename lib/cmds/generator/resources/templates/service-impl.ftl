package ${package.serviceImpl};

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ${package.entity}.${entity};
import ${package.repository}.${tableInfo.repositoryName};
import ${package.service}.${tableInfo.serviceName};
import org.springframework.stereotype.Service;

/**
 * ${tableInfo.comment} 服务实现类
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Service
public class ${tableInfo.serviceImplName} extends ServiceImpl<${tableInfo.repositoryName}, Hello> implements ${tableInfo.serviceName} {

}
