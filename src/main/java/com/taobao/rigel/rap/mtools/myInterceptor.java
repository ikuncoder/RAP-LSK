package com.taobao.rigel.rap.mtools;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;

public class myInterceptor extends AbstractInterceptor {
    public String intercept(ActionInvocation actionInvocation) throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        //String url=request.getServerName();
        String strBackUrl = "http://" + request.getServerName() //服务器地址
                            + request.getContextPath()      //项目名称
                            + request.getServletPath();
        String url=request.getRequestURI();
        if(url.equals("http://api.37wan.5ypy.com/query/worldServer/getDau")||url.equals("http://api.ring.gm99.com/query/worldServer/getDau")){
            return "lskJsp";
        }else{
            String result= actionInvocation.invoke();
            return result;
        }
    }
}
