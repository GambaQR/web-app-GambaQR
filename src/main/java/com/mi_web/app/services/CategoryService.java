package com.mi_web.app.services;

import com.mi_web.app.exceptions.ResourceNotFoundException;
import com.mi_web.app.models.Category;
import com.mi_web.app.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("La categoría con ID " + id + " no existe."));
    }

    public Category updateCategory(Long id, Category updatedCategory) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la categoría con ID " + id));

        category.setName(updatedCategory.getName());
        category.setDescription(updatedCategory.getDescription());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se puede eliminar la categoría, ID " + id + " no encontrado."));

        categoryRepository.delete(category);
    }
}
