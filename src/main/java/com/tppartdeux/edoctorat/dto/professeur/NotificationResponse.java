package com.tppartdeux.edoctorat.dto.professeur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Notification response DTO matching Angular's Notification interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private CommissionResponse commission;
    private SujetResponse sujet;
    private String type;
}
