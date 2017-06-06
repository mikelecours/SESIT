import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import java.util.List;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import javax.naming.*;
import javax.sql.*;
import java.sql.*; 
 
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

//Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

public class DatabaseSearchHandler extends HttpServlet {
 
	String connectionStatus = "Not Connected"; //Placeholder string to be used to validate connection
	ResultSet rst; //stores the results of the database query
 
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		
		////// This code block reads the request data sent with the post request and parses it to a JSON object to read //////
		List<String> columnNames = new ArrayList<String>();
		List<JsonObject> resultList = new ArrayList<JsonObject>();
		
		// Get the request data as a string
		StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String str = null;
        
		while ((str = br.readLine()) != null) {
            sb.append(str);
        }
		String requestData = sb.toString();

		try {
				
			// Convert the request data string to a JSON object so we can read it
			JsonObject jsonRequestObject = new Gson().fromJson(requestData, JsonObject.class);
			//Read the relevant data (table for this servlet)
			String tableName = jsonRequestObject.get("table").getAsString();
			
			// Read from File to String
	        JsonObject queries = new JsonObject();
 
        	// Try to read in json file with query
        	JsonParser parser = new JsonParser();
            JsonElement jsonElement = parser.parse(new FileReader("../webapps/ContractExplorer/WEB-INF/queries.json"));
            queries = jsonElement.getAsJsonObject();
            
            String query = queries.get(tableName).getAsString(); //query is full search string
            //System.out.println(query);
            
			////// End parsing block //////

            //attempt to connect to the database
			Context ctx = new InitialContext();
            
			//if(ctx == null )
            //    throw new Exception("Boom - No Context");
    
            // /jdbc/postgres is the name of the resource above 
            DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/postgres");
        
            if (ds != null) //datasourse exists
            {
                //Connection conn = ds.getConnection(); //gets connection from datasource
                
                try ( Connection conn = ds.getConnection() ) { //try with resource
                	
                	if(conn != null) 
                    {
                        
	    					/////// This code block will fetch database results using only table name passed in from get request ////////
    					
    					Statement stmt = conn.createStatement(); 
                        rst = stmt.executeQuery(query); //contains query Contact
                        
                        if (rst.isBeforeFirst()) {
	    					ResultSetMetaData rstm = rst.getMetaData(); //Contains details like row count and column names for auto populating and creating table
	    					int numOfColumns = rstm.getColumnCount(); //metadata from table to know how to build dynamically
	    					
	    					for(int i=1;i<=numOfColumns;i++) {
	    						columnNames.add(rstm.getColumnName(i)); //loop through to get all column names
	    					}
	    					
	    			        while(rst.next()) { // convert each object to an human readable JSON object
	    						JsonObject jsonObject = new JsonObject();
	    						
	    						for(int i=1; i<=numOfColumns; i++) {
	    							//Get column name and associated value for this result
	    							String key = columnNames.get(i - 1);
	    							String value = rst.getString(i);
	    							
	    							jsonObject.addProperty(key, value); //Add a json element in format key: value -- ie. cont_first_name: Bill
	    						}
	    						
	    						resultList.add(jsonObject);
	    					}		
                        }
                        
                        conn.close(); //should not be necessary due to try with resource
    					
    					/////// End database fetch ////////
                        
                    	// Send results back to front-end
                		PrintWriter out = response.getWriter();
                		String jsonString = new Gson().toJson(resultList);
                		
                		out.println(jsonString);
                    }
                	
                } catch (Exception e2) {
                	
                	String issue = e2.getMessage();
					
					JsonObject errorObject = new JsonObject();
					
					errorObject.addProperty("Success", false);
					errorObject.addProperty("Message", issue);
					
					PrintWriter out = response.getWriter();
					String jsonString = new Gson().toJson(errorObject);
					
					out.println(jsonString);
                	
                }
                
            }
        }
        catch(Exception e1) //error handling
        {
        	//e1.printStackTrace();
        	String issue = e1.getMessage();
			
			JsonObject errorObject = new JsonObject();
			
			errorObject.addProperty("Success", false);
			errorObject.addProperty("Message", issue);
			
			PrintWriter out = response.getWriter();
			String jsonString = new Gson().toJson(errorObject);
			
			out.println(jsonString);
			
        }
    }
 
}