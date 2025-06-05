package com.mi_web.app.repositories;

import com.mi_web.app.models.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Integer> {
    List<MenuCategory> findByMenuId(Integer menuId);
}
