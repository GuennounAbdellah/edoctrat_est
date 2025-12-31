// package com.tppartdeux.edoctorat.controller.auth;

// import com.tppartdeux.edoctorat.model.auth.GroupPermissions;
// import com.tppartdeux.edoctorat.service.auth.GroupPermissionsService;
// import com.tppartdeux.edoctorat.service.auth.GroupService;
// import com.tppartdeux.edoctorat.service.auth.PermissionService;
// import lombok.RequiredArgsConstructor;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/auth/group-permissions")
// @RequiredArgsConstructor
// public class GroupPermissionsController {

//     @Autowired
//     private final GroupPermissionsService groupPermissionsService;
//     @Autowired
//     private final GroupService groupService;
//     @Autowired
//     private final PermissionService permissionService;
//     //CRUD Functions
//     // Create
//     @PostMapping
//     public ResponseEntity<GroupPermissions> create(@RequestBody GroupPermissions groupPermissions) {
//         GroupPermissions created = groupPermissionsService.create(groupPermissions);
//         return new ResponseEntity<>(created, HttpStatus.CREATED);
//     }

//     // Read All
//     @GetMapping
//     public ResponseEntity<List<GroupPermissions>> findAll() {
//         List<GroupPermissions> groupPermissions = groupPermissionsService.findAll();
//         return ResponseEntity.ok(groupPermissions);
//     }

//     // Read By ID
//     @GetMapping("/{id}")
//     public ResponseEntity<GroupPermissions> findById(@PathVariable Long id) {
//         return groupPermissionsService.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Read By Group
//     @GetMapping("/group/{groupId}")
//     public ResponseEntity<List<GroupPermissions>> findByGroup(@PathVariable Integer groupId) {
//         return groupService.findById(groupId)
//                 .map(group -> ResponseEntity.ok(groupPermissionsService.findByGroup(group)))
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Read By Permission
//     @GetMapping("/permission/{permissionId}")
//     public ResponseEntity<List<GroupPermissions>> findByPermission(@PathVariable Integer permissionId) {
//         return permissionService.findById(permissionId)
//                 .map(permission -> ResponseEntity.ok(groupPermissionsService.findByPermission(permission)))
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Update
//     @PutMapping("/{id}")
//     public ResponseEntity<GroupPermissions> update(@PathVariable Long id, @RequestBody GroupPermissions groupPermissions) {
//         try {
//             GroupPermissions updated = groupPermissionsService.update(id, groupPermissions);
//             return ResponseEntity.ok(updated);
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Delete
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable Long id) {
//         try {
//             groupPermissionsService.delete(id);
//             return ResponseEntity.noContent().build();
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // Count
//     @GetMapping("/count")
//     public ResponseEntity<Long> count() {
//         return ResponseEntity.ok(groupPermissionsService.count());
//     }
// }
