package fi.vm.sade.henkiloui.configurations.security;

import fi.vm.sade.henkiloui.configurations.properties.DevProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Profile("dev")
@Configuration
@EnableGlobalMethodSecurity(jsr250Enabled = false, prePostEnabled = true, securedEnabled = true)
@EnableWebSecurity
public class SecurityDevConfiguration extends WebSecurityConfigurerAdapter {
    private DevProperties devProperties;

    @Autowired
    public SecurityDevConfiguration(DevProperties devProperties) {
        this.devProperties = devProperties;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic()
        .and()
        .csrf().disable()
        .authorizeRequests()
            .antMatchers("/buildversion.txt").permitAll()
            .antMatchers("/swagger-ui.html").permitAll()
            .antMatchers("/swagger-resources/**").permitAll()
            .antMatchers("/v2/api-docs").permitAll()
            .anyRequest().authenticated();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser(devProperties.getUsername()).password(devProperties.getPassword())
                .roles("APP_HENKILONHALLINTA_OPHREKISTERI");
    }
}