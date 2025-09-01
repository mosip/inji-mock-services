package com.mosip.inji_usecase.config;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.persistenceunit.PersistenceUnitManager;

@Configuration
public class JpaConfig {

    @Bean
    public EntityManagerFactoryBuilder entityManagerFactoryBuilder(
            JpaVendorAdapter jpaVendorAdapter,
            JpaProperties jpaProperties,
            ObjectProvider<PersistenceUnitManager> persistenceUnitManager) {
        return new EntityManagerFactoryBuilder(
                jpaVendorAdapter,
                jpaProperties.getProperties(),
                persistenceUnitManager.getIfAvailable()
        );
    }
}
