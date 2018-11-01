package com.taobao.rigel.rap.mock.dao.impl;

import com.taobao.rigel.rap.mock.bo.Rule;
import com.taobao.rigel.rap.mock.dao.MockDao;
import com.taobao.rigel.rap.project.bo.Action;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;
import org.w3c.dom.Document;

import javax.persistence.criteria.CriteriaBuilder.In;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Bosn on 15/7/17.
 */
public class MockDaoImpl extends HibernateDaoSupport implements MockDao {

    public String getPageIdByActionId(int actionId){
        String sql="select page_id from tb_action_and_page where action_id=?";
        SQLQuery query = currentSession().createSQLQuery(sql);
        query.setParameter(0,actionId);
        List result = query.list();
        List<String> ids = new ArrayList<String>();
        if(result.size()==0){
            return "0";
        }
        for (Object r : result) {
            ids.add(String.valueOf((Integer)r));
        }
        //因为只能是返回一个结果
        return ids.get(0);
    }

    public int getPageIdBydDomainName(String DomainName){
        /*StringBuilder sql = new StringBuilder();
        sql.append("SELECT id ");
        sql.append("FROM tb_page");
        sql.append("WHERE introduction=?");*/
        String sql="SELECT id FROM tb_page WHERE introduction=?";
        SQLQuery query = currentSession().createSQLQuery(sql);
        query.setParameter(0,DomainName);
        List result = query.list();
        List<Integer> ids = new ArrayList<Integer>();
        for (Object r : result) {
            ids.add((Integer) r);
        }
        //因为只能是返回一个结果
        return ids.get(0);
    }

    public String  getDomainNameActionId(int actionId){
        String sql="select p.introduction from tb_page p join tb_action_and_page aap on aap.page_id=p.id where aap.action_id=?";
        SQLQuery query = currentSession().createSQLQuery(sql);
        query.setParameter(0,actionId);
        List result = query.list();
        List<String> ids = new ArrayList<String>();
        if(result.size()==0){
            return "-1";
        }
        for (Object r : result) {
            ids.add((String) r);
        }
        //因为只能是返回一个结果
        return ids.get(0);
    }

    public String getDomainNameByPageId(int pageId) {
        String sql="SELECT p.introduction FROM tb_page p " +
                   "join tb_action_and_page anp on anp.page_id=p.id where anp.action_id=?";
        SQLQuery query = currentSession().createSQLQuery(sql);
        query.setParameter(0,pageId);
        List result = query.list();
        List<String> ids = new ArrayList<String>();
        for (Object r : result) {
            ids.add((String) r);
        }
        //因为只能是返回一个结果
        return ids.get(0);
    }


    public Rule getRule(int actionId) {
        Rule rule = null;
        try {
            Session session = currentSession();
            rule = (Rule) session.get(Rule.class, actionId);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return rule;
    }

    
    public int removeRule(int actionId) {
        Session session = currentSession();
        Object rule = session.get(Rule.class, actionId);
        if (rule != null) {
            session.delete((Rule) rule);
            return 0;
        } else {
            return -1;
        }
    }

    
    public int updateRule(Rule rule) {
        Session session = currentSession();
        session.update(rule);
        return 0;
    }

    
    public int addRule(Rule rule) {
        Session session = currentSession();
        session.save(rule);
        return 0;
    }
}
