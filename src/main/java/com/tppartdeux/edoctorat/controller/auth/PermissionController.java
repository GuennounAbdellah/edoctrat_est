// package com.tppartdeux.edoctorat.controller.auth;

// import com.tppartdeux.edoctorat.model.auth.Permission;
// import com.tppartdeux.edoctorat.service.auth.PermissionService;
// import lombok.RequiredArgsConstructor;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/auth/permissions")
// @RequiredArgsConstructor
// public class PermissionController {

//     @Autowired
//     private final PermissionService permissionService;
//     //CRUD Functions
//     // Create
//     @PostMapping
//     public ResponseEntity<Permission> create(@RequestBody Permission permission) {
//         Permission created = permissionService.create(permission);
//         return new ResponseEntity<>(created, HttpStatus.CREATED);
//     }

//     // Read All
//     @GetMapping
//     public ResponseEntity<List<Permission>> findAll() {
//         List<Permission> permissions = permissionService.findAll();
//         return ResponseEntity.ok(permissions);
//     }

//     // Read By ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Permission> findById(@PathVariable Integer id) {
//         return permissionService.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Read By Codename
//     @GetMapping("/codename/{codename}")
//     public ResponseEntity<Permission> findByCodename(@PathVariable String codename) {
//         return permissionService.findByCodename(codename)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Update
//     @PutMapping("/{id}")
//     public ResponseEntity<Permission> update(@PathVariable Integer id, @RequestBody Permission permission) {
//         try {
//             Permission updated = permissionService.update(id, permission);
//             return ResponseEntity.ok(updated);
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable Integer id) {
//         try {
//             permissionService.delete(id);
//             return ResponseEntity.noContent().build();
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete All
//     @DeleteMapping
//     public ResponseEntity<Void> deleteAll() {
//         permissionService.deleteAll();
//         return ResponseEntity.noContent().build();
//     }

//     // Count
//     @GetMapping("/count")
//     public ResponseEntity<Long> count() {
//         return ResponseEntity.ok(permissionService.count());
//     }
// }
