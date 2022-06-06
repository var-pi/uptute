package com.uptute.backend.payloads.lessons;

import java.util.List;

import lombok.Data;
import lombok.NonNull;

@Data
public class GetOffersResponse {
    @NonNull
    private List<Long> logs;
}
