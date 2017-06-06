import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import javax.sql.DataSource;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

//Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

public class DatabaseInsertHandler extends HttpServlet {

		protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		
		//Get json-formatted request object from the webpage
		StringBuilder sb = new StringBuilder();
        BufferedReader br = request.getReader();
        String str = null;
        while ((str = br.readLine()) != null) {
            sb.append(str);
        }
		String requestData = sb.toString();
		//End request builder
		
		try // Documentation https://jdbc.postgresql.org/documentation/94/tomcat.html
        {
		
			//Variable Declarations
			List <String> addNames = new ArrayList<String>();
			//List <String> addNames = new ArrayList<String>();
			
			JsonObject jsonRequestObject = new Gson().fromJson(requestData, JsonObject.class); //parse the json as a string to a json object
			JsonObject newValues = jsonRequestObject.getAsJsonObject("values");
			String tableName = jsonRequestObject.get("table").getAsString();
			
			JsonParser parser = new JsonParser();
	        JsonElement jsonElement = parser.parse(new FileReader("../webapps/ContractExplorer/WEB-INF/dataTypes.json"));
	        JsonObject types = (JsonObject) (jsonElement.getAsJsonObject()).get(tableName);
	        
			//JsonObject types = jsonRequestObject.getAsJsonObject("types");
			
			//Format for the table to insert in to data and the values to be inserted (to be combined upon SQL execution)
			String insertTable = "INSERT INTO contrs." + jsonRequestObject.get("table").getAsString() + " (";
			String insertValue = "VALUES (";
			
			//Temp variables in statement building
			String value = new String();
			String dataType = new String();
			String columnName = new String();
			int prepIndex = 1;		
			
			//Mapping to retrieve the keys/names of the json elements which correspond to the column names for the database
			Set<Map.Entry<String, JsonElement>> entries = newValues.entrySet();
			
			for (Map.Entry<String, JsonElement> entry: entries) { //loop through map, get the keys/names
				addNames.add(entry.getKey().toString()); //add the keys/names to a list
			}
			
			/*Set<Map.Entry<String, JsonElement>> entriesTypes = types.entrySet();//will return members of your object
			
			//Mapping to retrieve the keys/names of the json elements which correspond to the column names for the database
			for (Map.Entry<String, JsonElement> entry: entriesTypes) {
				addTypes.add(entry.getKey().toString());
			} */
				
			
			//loop through to create the sql insert statement (using placeholder ? values to be changed in prepared statement)
			for (int i = 0; i < addNames.size(); i++) {
				
				columnName = addNames.get(i);
				
				insertTable = insertTable + columnName;
				
				insertValue = insertValue + " ? ";
				
				if ( i < (addNames.size() - 1) ) { //commas after all but last element
					insertTable = insertTable + ", ";
					insertValue = insertValue + ", ";
				}
			}
	
			//closing formatting for two parts of string 
			insertTable = insertTable + ") ";
			insertValue = insertValue + ");";
			
			//end INSERT building
			
			//System.out.println("Insert Attempted: " + insertTable + insertValue); //console logging
			
            //attempt to connect to the database
			Context ctx = new InitialContext();
            
			//if(ctx == null )
            //    throw new Exception("Boom - No Context");
    
            // /jdbc/postgres is the name of the resource above 
            DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/postgres");
        
		
			if (ds != null) //data source exists
			{
				
				try ( Connection conn = ds.getConnection() ) { // try-with-resource : auto closes database connection normally and with errors
					
					if(conn != null) 
					{		
						//Use a prepared statement: avoids injection issues and escape characters
						PreparedStatement stmt = conn.prepareStatement( insertTable + insertValue ); 
						
						//Loop through prepared statement and replace values where appropriate
						for (int i = 0; i < addNames.size(); i++ ) {
							
							//Placeholder assignment
							columnName =  addNames.get(i);
							
							if (newValues.has(columnName)) {
								value = newValues.get(columnName).getAsString();
							} else {
								value = null;
							}
							
							dataType = types.get(columnName).getAsString();					
							
							//Handle different data types
							switch( dataType ) {
								case "String" :
									if ( value == null || value.equals("")) {
										stmt.setNull(prepIndex, java.sql.Types.CHAR);
									} else {
										stmt.setString(prepIndex, value);
									}
									break;
									
								case "Boolean" :
									if( value == null || value.equals("")) {
										stmt.setNull(prepIndex, java.sql.Types.BOOLEAN);
									} else if ( ( value ).equals("t") ) {
										stmt.setBoolean(prepIndex, true);
									} else {
										stmt.setBoolean(prepIndex, false);
									}								
									break;
									
								case "Integer" :
									if ( value == null || value.equals("")) {
										stmt.setNull(prepIndex, java.sql.Types.INTEGER);
									} else {
										stmt.setInt(prepIndex, Integer.parseInt(value));
									}
									break;
								
								case "TimeStamp":
									if ( value == null || value.equals("")) {
										stmt.setNull(prepIndex, java.sql.Types.TIMESTAMP);
									} else {
										Timestamp timeStamp = Timestamp.valueOf(value);
										stmt.setTimestamp(prepIndex, timeStamp);
									}
									break;
							}
							
							prepIndex++;
						}
						
						stmt.executeUpdate(); //execute insert
						
						JsonObject errorObject = new JsonObject();
						
						errorObject.addProperty("Success", true);
						
						PrintWriter out = response.getWriter();
						String jsonString = new Gson().toJson(errorObject);
						
						out.println(jsonString);
						
					}
					
				} catch (Exception e1) {
					// handle exception
					String issue = e1.getMessage();
					
					JsonObject errorObject = new JsonObject();
					
					errorObject.addProperty("Success", false);
					errorObject.addProperty("Message", issue);
					
					PrintWriter out = response.getWriter();
					String jsonString = new Gson().toJson(errorObject);
					
					out.println(jsonString);
				}
								
			}
		} catch(Exception e) {
        	
        	//String errorDescription = e.getMessage();
            e.printStackTrace(); //Default -- to be changed later
           
            String issue = e.getMessage();
			
			JsonObject errorObject = new JsonObject();
			
			errorObject.addProperty("Success", false);
			errorObject.addProperty("Message", issue);
			
			PrintWriter out = response.getWriter();
			String jsonString = new Gson().toJson(errorObject);
			
			out.println(jsonString);
        }
	}

}