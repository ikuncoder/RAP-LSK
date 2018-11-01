package com.taobao.rigel.rap.lsk.web.action;

import com.taobao.rigel.rap.common.base.ActionBase;
import com.taobao.rigel.rap.mock.service.MockMgr;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class lskAction extends ActionBase {
    private MockMgr mockMgr;
    public String path;

    public String lskTest(){
        return SUCCESS;
    }

    public String createRule(){
        /**
         * 思路：拿到域名，根据域名拿到pageid
         */
        HttpServletResponse response = ServletActionContext.getResponse();
        HttpServletRequest request = ServletActionContext.getRequest();
        String url=request.getServerName();
        String strBackUrl = request.getContextPath()+ request.getServletPath();
        int pageId=mockMgr.getPageIdBydDomainName(url);
        //path="/mockjsdata/"+pageId+"/query/worldServer/getDau";
        path="/mockjs/"+pageId+strBackUrl;
        return SUCCESS;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public MockMgr getMockMgr() {
        return mockMgr;
    }

    public void setMockMgr(MockMgr mockMgr) {
        this.mockMgr = mockMgr;
    }
}
