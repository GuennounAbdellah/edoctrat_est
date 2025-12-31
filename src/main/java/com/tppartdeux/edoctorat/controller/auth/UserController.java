// package com.tppartdeux.edoctorat.controller.auth;

// import com.tppartdeux.edoctorat.model.auth.User;
// import com.tppartdeux.edoctorat.service.auth.UserService;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;

// import java.util.List;

// import org.springframework.web.bind.annotation.*;
// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/auth/users")
// @RequiredArgsConstructor
// public class UserController {

//    private final UserService userService;
    
//    //CRUD Functions
//     // Create
//     @PostMapping
//     public ResponseEntity<User> create(@RequestBody User user) {
//         User created = userService.create(user);
//         return new ResponseEntity<>(created, HttpStatus.CREATED);
//     }

//     // Read All
//     @GetMapping
//     public ResponseEntity<List<User>> findAll() {
//         List<User> users = userService.findAll();
//         return ResponseEntity.ok(users);
//     }

//     // Read By ID
//     @GetMapping("/{id}")
//     public ResponseEntity<User> findById(@PathVariable Integer id) {
//         return userService.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Read By Username
//     @GetMapping("/username/{username}")
//     public ResponseEntity<User> findByUsername(@PathVariable String username) {
//         return userService.findByUsername(username)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Read By Email
//     @GetMapping("/email/{email}")
//     public ResponseEntity<User> findByEmail(@PathVariable String email) {
//         return userService.findByEmail(email)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Check if username exists
//     @GetMapping("/exists/username/{username}")
//     public ResponseEntity<Boolean> existsByUsername(@PathVariable String username) {
//         return ResponseEntity.ok(userService.existsByUsername(username));
//     }

//     // Check if email exists
//     @GetMapping("/exists/email/{email}")
//     public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
//         return ResponseEntity.ok(userService.existsByEmail(email));
//     }

//     // Update
//     @PutMapping("/{id}")
//     public ResponseEntity<User> update(@PathVariable Integer id, @RequestBody User user) {
//         try {
//             User updated = userService.update(id, user);
//             return ResponseEntity.ok(updated);
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable Integer id) {
//         try {
//             userService.delete(id);
//             return ResponseEntity.noContent().build();
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete All
//     @DeleteMapping
//     public ResponseEntity<Void> deleteAll() {
//         userService.deleteAll();
//         return ResponseEntity.noContent().build();
//     }

//     // Count
//     @GetMapping("/count")
//     public ResponseEntity<Long> count() {
//         return ResponseEntity.ok(userService.count());
//     }
// }
