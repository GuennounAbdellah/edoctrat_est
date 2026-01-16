package com.tppartdeux.edoctorat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic wrapper DTO matching Angular's Result<T> interface
 * Used for paginated responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultDTO<T> {
    private long count;
    private String next;
    private String previous;
    private List<T> results;

    public static <T> ResultDTO<T> of(List<T> items) {
        return ResultDTO.<T>builder()
                .count(items.size())
                .next(null)
                .previous(null)
                .results(items)
                .build();
    }

    public static <T> ResultDTO<T> of(List<T> items, long totalCount, String next, String previous) {
        return ResultDTO.<T>builder()
                .count(totalCount)
                .next(next)
                .previous(previous)
                .results(items)
                .build();
    }
}
