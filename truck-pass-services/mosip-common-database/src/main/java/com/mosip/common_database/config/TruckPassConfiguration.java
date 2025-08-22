//package com.mosip.common_database.config;
//
//import javax.sql.DataSource;
//
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.jdbc.DataSourceBuilder;
//import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.PropertySource;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.orm.jpa.JpaTransactionManager;
//import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
//import org.springframework.transaction.PlatformTransactionManager;
//
//import jakarta.persistence.EntityManagerFactory;
//
//@Configuration
//@PropertySource({"classpath:database.properties"})
//@EnableJpaRepositories(
//        basePackages = "com.mosip.common_database.repository.truckpass", // repository package
//        entityManagerFactoryRef = "truckPassEntityManager",
//        transactionManagerRef = "truckPassTransactionManager"
//)
//public class TruckPassConfiguration {
//
//    @Bean
//    @ConfigurationProperties(prefix = "spring.truckpass-datasource")
//    public DataSource truckPassDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//    @Bean
//    public LocalContainerEntityManagerFactoryBean truckPassEntityManager(
//            @Qualifier("truckPassDataSource") DataSource dataSource,
//            EntityManagerFactoryBuilder builder) {
//
//        return builder
//                .dataSource(dataSource)
//                .packages("com.mosip.common_database.entity.truckpass") // entity package
//                .persistenceUnit("truckpass")
//                .build();
//    }
//
//    @Bean
//    public PlatformTransactionManager truckPassTransactionManager(
//            @Qualifier("truckPassEntityManager") EntityManagerFactory emf) {
//        return new JpaTransactionManager(emf);
//    }
//}
