//package com.tppartdeux.edoctorat.controller.auth;
//
//import com.tppartdeux.edoctorat.model.auth.UserGroups;
//import com.tppartdeux.edoctorat.service.auth.UserGroupsService;
//import com.tppartdeux.edoctorat.service.auth.UserService;
//import com.tppartdeux.edoctorat.service.auth.GroupService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import java.util.List;
//
//import org.springframework.web.bind.annotation.*;
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/auth/user-groups")
//@RequiredArgsConstructor
//public class UserGroupsController {
//
//
//    @Autowired
//    private final UserGroupsService userGroupsService;
//    @Autowired
//    private final UserService userService;
//    @Autowired
//    private final GroupService groupService;
//
//    //CRUD Functions
//    // Create
//    @PostMapping
//    public ResponseEntity<UserGroups> create(@RequestBody UserGroups userGroups) {
//        UserGroups created = userGroupsService.create(userGroups);
//        return new ResponseEntity<>(created, HttpStatus.CREATED);
//    }
//
//    // Read All
//    @GetMapping
//    public ResponseEntity<List<UserGroups>> findAll() {
//        List<UserGroups> userGroups = userGroupsService.findAll();
//        return ResponseEntity.ok(userGroups);
//    }
//
//    // Read By ID
//    @GetMapping("/{id}")
//    public ResponseEntity<UserGroups> findById(@PathVariable Long id) {
//        return userGroupsService.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Read By User
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<UserGroups>> findByUser(@PathVariable Integer userId) {
//        return userService.findById(userId)
//                .map(user -> ResponseEntity.ok(userGroupsService.findByUser(user)))
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Read By Group
//    @GetMapping("/group/{groupId}")
//    public ResponseEntity<List<UserGroups>> findByGroup(@PathVariable Integer groupId) {
//        return groupService.findById(groupId)
//                .map(group -> ResponseEntity.ok(userGroupsService.findByGroup(group)))
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Update
//    @PutMapping("/{id}")
//    public ResponseEntity<UserGroups> update(@PathVariable Long id, @RequestBody UserGroups userGroups) {
//        try {
//            UserGroups updated = userGroupsService.update(id, userGroups);
//            return ResponseEntity.ok(updated);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    // Delete
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        try {
//            userGroupsService.delete(id);
//            return ResponseEntity.noContent().build();
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    // Count
//    @GetMapping("/count")
//    public ResponseEntity<Long> count() {
//        return ResponseEntity.ok(userGroupsService.count());
//    }
//}
