package com.mosip.inji_usecase.config;

import javax.sql.DataSource;

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

import jakarta.persistence.EntityManagerFactory;

@Configuration
@PropertySource({ "classpath:database.properties" })
@EnableJpaRepositories(
        basePackages = "com.mosip.inji_usecase.repository.company",
        entityManagerFactoryRef = "companyEntityManager",
        transactionManagerRef = "companyTransactionManager"
)
public class CompanyConfiguration {

    @Bean(name = "companyDataSource")
    @ConfigurationProperties(prefix = "spring.company-datasource")
    public DataSource companyDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "companyEntityManager")
    public LocalContainerEntityManagerFactoryBean companyEntityManager(
            EntityManagerFactoryBuilder builder,
            @Qualifier("companyDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.mosip.inji_usecase.entity.company")
                .persistenceUnit("company")
                .build();
    }

    @Bean(name = "companyTransactionManager")
    public PlatformTransactionManager companyTransactionManager(
            @Qualifier("companyEntityManager") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
