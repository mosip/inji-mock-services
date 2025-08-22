package com.mosip.inji_usecase.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import jakarta.persistence.EntityManagerFactory;

@Configuration
@PropertySource({"classpath:database.properties"})
@EnableJpaRepositories(
    basePackages="com.mosip.inji_usecase.repository.certify",
    entityManagerFactoryRef="certifyEntityManager",
    transactionManagerRef="certifyTransactionManager")
public class CertifyConfiguration {

    @Primary
    @Bean
    @ConfigurationProperties(prefix="spring.certify-datasource")
    public DataSource certifyDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean
    public LocalContainerEntityManagerFactoryBean certifyEntityManager(
        @Qualifier("certifyDataSource") DataSource dataSource,
        EntityManagerFactoryBuilder builder){
            
            return builder
            .dataSource(dataSource)
            .packages("com.mosip.inji_usecase.entity.certify")
            .persistenceUnit("certify")
            .build();
        }

    @Primary
    @Bean
    public PlatformTransactionManager certifyTransactionManager(
        @Qualifier("certifyEntityManager") EntityManagerFactory emf){
            return new JpaTransactionManager(emf);
        }
}
