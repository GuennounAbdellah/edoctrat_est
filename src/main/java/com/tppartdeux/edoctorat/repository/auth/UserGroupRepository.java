package com.tppartdeux.edoctorat.repository.auth;

import com.tppartdeux.edoctorat.model.auth.UserGroups;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.auth.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroups, Long> {
    List<UserGroups> findByUser(User user);
    List<UserGroups> findByGroup(Group group);
}
