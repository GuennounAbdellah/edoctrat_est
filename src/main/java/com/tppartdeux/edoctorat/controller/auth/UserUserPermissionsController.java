//package com.tppartdeux.edoctorat.controller.auth;
//
//import com.tppartdeux.edoctorat.model.auth.UserUserPermissions;
//
//import com.tppartdeux.edoctorat.service.auth.UserUserPermissionsService;
//import com.tppartdeux.edoctorat.service.auth.UserService;
//import com.tppartdeux.edoctorat.service.auth.PermissionService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import org.springframework.web.bind.annotation.*;
//import lombok.RequiredArgsConstructor;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/auth/user-permissions")
//@RequiredArgsConstructor
//public class UserUserPermissionsController {
//
//    @Autowired
//    private final UserUserPermissionsService userUserPermissionsService;
//    @Autowired
//    private final UserService userService;
//    @Autowired
//    private final PermissionService permissionService;
//    //CRUD Functions
//    // Create
//    @PostMapping
//    public ResponseEntity<UserUserPermissions> create(@RequestBody UserUserPermissions userUserPermissions) {
//        UserUserPermissions created = userUserPermissionsService.create(userUserPermissions);
//        return new ResponseEntity<>(created, HttpStatus.CREATED);
//    }
//
//    // Read All
//    @GetMapping
//    public ResponseEntity<List<UserUserPermissions>> findAll() {
//        List<UserUserPermissions> userUserPermissions = userUserPermissionsService.findAll();
//        return ResponseEntity.ok(userUserPermissions);
//    }
//
//    // Read By ID
//    @GetMapping("/{id}")
//    public ResponseEntity<UserUserPermissions> findById(@PathVariable Long id) {
//        return userUserPermissionsService.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Read By User
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<UserUserPermissions>> findByUser(@PathVariable Integer userId) {
//        return userService.findById(userId)
//                .map(user -> ResponseEntity.ok(userUserPermissionsService.findByUser(user)))
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Read By Permission
//    @GetMapping("/permission/{permissionId}")
//    public ResponseEntity<List<UserUserPermissions>> findByPermission(@PathVariable Integer permissionId) {
//        return permissionService.findById(permissionId)
//                .map(permission -> ResponseEntity.ok(userUserPermissionsService.findByPermission(permission)))
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Update
//    @PutMapping("/{id}")
//    public ResponseEntity<UserUserPermissions> update(@PathVariable Long id, @RequestBody UserUserPermissions userUserPermissions) {
//        try {
//            UserUserPermissions updated = userUserPermissionsService.update(id, userUserPermissions);
//            return ResponseEntity.ok(updated);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    // Count
//    @GetMapping("/count")
//    public ResponseEntity<Long> count() {
//        return ResponseEntity.ok(userUserPermissionsService.count());
//    }
//}
