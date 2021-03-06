package fi.vm.sade.henkiloui.dto;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LokalisointiCriteria {

    private String category;
    private String locale;

    public Map<String, Object> asMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        Optional.ofNullable(category).ifPresent(value -> map.put("category", value));
        Optional.ofNullable(locale).ifPresent(value -> map.put("locale", value));
        return map;
    }

}
