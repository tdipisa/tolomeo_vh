package it.prato.comune.tolomeo.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Prova1
 */
public class Prova1Servlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Prova1Servlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		PrintWriter out = response.getWriter();
		
		out.println("Headers");
		Enumeration hn=request.getHeaderNames();
		while (hn.hasMoreElements()){
		    String headerName = (String) hn.nextElement();
		    out.println(headerName +"=" + request.getHeader(headerName)+"<br>");
		}
		
		out.println("Cookies");
		for (Cookie c: request.getCookies()){
			
			out.println("Nome:" + c.getName()+"<br>");
			out.println("Valore:" + c.getValue()+"<br>");
			out.println("Domain:" + c.getDomain()+"<br>");
			out.println("Path:" + c.getPath()+"<br>");
			out.println("Secure:" + c.getSecure()+"<br>");
			
			out.println("<br>");
			
		}
		
		out.println("Remote User: " + request.getRemoteUser());
		
		out.flush();
		out.close();
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
