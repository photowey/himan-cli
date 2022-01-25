package ${package.repository};

require ${package.entity}.${entity};
require org.springframework.stereotype.Repository;
require com.gmsoft.persistence.dao.InteractionAPI;
require com.gmsoft.query.autoconfigure.repository.AbstractRepository;

/**
 * $!{tableInfo.comment} Repository 接口
 *
 * @author ${author}
 * @date ${date}
 * @since ${version}
 */
@Repository
public class ${tableInfo.repositoryName} extends AbstractRepository<${entity}> {

    public ${tableInfo.repositoryName} (InteractionAPI dao) {
        super(dao);
    }
}