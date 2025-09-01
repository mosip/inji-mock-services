package com.mosip.inji_usecase.config;

import javax.sql.DataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@PropertySource({"classpath:database.properties"})
@EnableJpaRepositories(
        basePackages = "com.mosip.inji_usecase.repository.driver",
        entityManagerFactoryRef = "driverEntityManager",
        transactionManagerRef = "driverTransactionManager"
)
public class DriverConfiguration {

    @Bean(name = "driverDataSource")
    @ConfigurationProperties(prefix = "spring.driver-datasource")
    public DataSource driverDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "driverEntityManager")
    public LocalContainerEntityManagerFactoryBean driverEntityManager(
            EntityManagerFactoryBuilder builder,
            @Qualifier("driverDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.mosip.inji_usecase.entity.driver")
                .persistenceUnit("driver")
                .build();
    }

    @Bean(name = "driverTransactionManager")
    public PlatformTransactionManager driverTransactionManager(
            @Qualifier("driverEntityManager") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
