package com.mi_web.app.services;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SupabaseService {

    private final String SUPABASE_URL = "https://tigskydvwwqlfypfwyyq.supabase.co"; // URL del proyecto en Supabase
    private final String SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZ3NreWR2d3dxbGZ5cGZ3eXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mzc0MTQsImV4cCI6MjA2MzMxMzQxNH0.WRprX6IA1PGc-7E_8mr6ANHyPsuVbZZuivVL_7Mrh5Q"; // Clave anon del proyecto
    
   public String uploadImage(MultipartFile file) throws Exception {
    String bucketName = "imagenes";  // Nombre del bucket en Supabase

    // Generar un identificador único (UUID) y agregarlo al nombre del archivo
    String originalFileName = file.getOriginalFilename();
    String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;  // Agregar UUID al nombre original

    System.out.println("Generated Unique File Name: " + uniqueFileName); // Imprime el nombre único generado

    // URL para subir archivos en Supabase Storage (con el nombre único)
    String url = SUPABASE_URL + "/storage/v1/object/" + bucketName + "/" + uniqueFileName;

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + SUPABASE_ANON_KEY);

    // Crear un MultiValueMap para enviar el archivo
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("file", file.getResource());  // Agregar el archivo al cuerpo de la solicitud

    // Crear la entidad HTTP para la solicitud
    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // Realizar la solicitud
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

    // Imprimir la respuesta completa de Supabase para depurar
System.out.println("Response body: " + response.getBody());  // Imprimir toda la respuesta

// Verificar si la respuesta es correcta
if (response.getStatusCode() == HttpStatus.OK) {
    // Parsear la respuesta para obtener la URL
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode responseBody = objectMapper.readTree(response.getBody());

    // Imprimir toda la respuesta para ver los campos disponibles
    System.out.println("Response fields: " + responseBody.toString());  // Mostrar los campos

    // Usar 'Key' en lugar de 'path'
    if (responseBody.has("Key")) {
        // Extraer la URL pública del archivo desde la respuesta
        String fileKey = responseBody.get("Key").asText();
        String fileUrl = SUPABASE_URL + "/storage/v1/object/public/" + fileKey;
        return fileUrl;  // Retorna la URL completa del archivo
    } else {
        throw new Exception("No se encontró el campo 'Key' en la respuesta de Supabase.");
    }
} else {
    throw new Exception("Error al subir la imagen a Supabase. Response: " + response.getStatusCode());
}
}
}
