// package com.tppartdeux.edoctorat.controller.auth;

// import com.tppartdeux.edoctorat.model.auth.Group;
// import com.tppartdeux.edoctorat.service.auth.GroupService;
// import lombok.RequiredArgsConstructor;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/auth/groups")
// @RequiredArgsConstructor
// public class GroupController {

//     @Autowired
//     private final GroupService groupService;

//     //CRUD Functions
//     // Create
//     @PostMapping
//     public ResponseEntity<Group> create(@RequestBody Group group) {
//         Group created = groupService.create(group);
//         return new ResponseEntity<>(created, HttpStatus.CREATED);
//     }

//     // Read All
//     @GetMapping
//     public ResponseEntity<List<Group>> findAll() {
//         List<Group> groups = groupService.findAll();
//         return ResponseEntity.ok(groups);
//     }

//     // Read By ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Group> findById(@PathVariable Integer id) {
//         return groupService.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Read By Name
//     @GetMapping("/name/{name}")
//     public ResponseEntity<Group> findByName(@PathVariable String name) {
//         return groupService.findByName(name)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Check if name exists
//     @GetMapping("/exists/name/{name}")
//     public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
//         return ResponseEntity.ok(groupService.existsByName(name));
//     }

//     // Update
//     @PutMapping("/{id}")
//     public ResponseEntity<Group> update(@PathVariable Integer id, @RequestBody Group group) {
//         try {
//             Group updated = groupService.update(id, group);
//             return ResponseEntity.ok(updated);
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable Integer id) {
//         try {
//             groupService.delete(id);
//             return ResponseEntity.noContent().build();
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete All
//     @DeleteMapping
//     public ResponseEntity<Void> deleteAll() {
//         groupService.deleteAll();
//         return ResponseEntity.noContent().build();
//     }

//     // Count
//     @GetMapping("/count")
//     public ResponseEntity<Long> count() {
//         return ResponseEntity.ok(groupService.count());
//     }
// }
