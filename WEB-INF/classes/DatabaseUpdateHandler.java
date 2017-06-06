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
import java.sql.Timestamp;
import javax.sql.DataSource;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
 
//Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

public class DatabaseUpdateHandler extends HttpServlet {

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
		
		try
        {
			//Variable Declarations
			JsonObject jsonRequestObject = new Gson().fromJson(requestData, JsonObject.class);
			JsonObject original = jsonRequestObject.getAsJsonObject("original");
			JsonObject updated = jsonRequestObject.getAsJsonObject("updated");
			String tableName = jsonRequestObject.get("table").getAsString();		
			
			JsonParser parser = new JsonParser();
	        JsonElement jsonElement = parser.parse(new FileReader("../webapps/ContractExplorer/WEB-INF/dataTypes.json"));
	        JsonObject types = (JsonObject) (jsonElement.getAsJsonObject()).get(tableName);
			//JsonObject types = jsonRequestObject.getAsJsonObject("types");
			
			List<String> addNamesOriginal = new ArrayList<String>();
			List<String> addNamesUpdated = new ArrayList<String>();
			//List<String> addTypes = new ArrayList<String>();
			
			
			/*Set<Map.Entry<String, JsonElement>> entriesTypes = types.entrySet();//will return members of your object
			
			//Mapping to retrieve the keys/names of the json elements which correspond to the column names for the database
			for (Map.Entry<String, JsonElement> entry: entriesTypes) {
				addTypes.add(entry.getKey().toString());
			} */
			
			Set<Map.Entry<String, JsonElement>> entriesUpdated = updated.entrySet();//will return members of your object
			
			for (Map.Entry<String, JsonElement> entry: entriesUpdated) {
				addNamesUpdated.add(entry.getKey().toString());
			}
			
			Set<Map.Entry<String, JsonElement>> entriesOriginal = original.entrySet();//will return members of your object
			
			for (Map.Entry<String, JsonElement> entry: entriesOriginal) {
				addNamesOriginal.add(entry.getKey().toString());
			}
			
			//System.out.println("Made it past second mapping");
			
			//Format for update SQL (to be combined upon SQL execution)
			String updateTable = "UPDATE contrs." + tableName;
			String updateSet = " SET ";
			String updateWhere = " WHERE ";
			
			//Temp variables in statement building
			String value = new String();
			String dataType = new String();
			String columnName = new String();
			int prepIndex = 1;
			
			
			////// Insert Building //////
			
			//loop through to create the sql insert statement (using placeholder ? values to be changed in PreparedStatement)
			for (int i = 0; i < addNamesUpdated.size(); i++) {
				
				columnName =  addNamesUpdated.get(i);
				
				updateSet = updateSet + columnName + " = ? ";
					
				if ( i < (addNamesUpdated.size() - 1) ) {
					updateSet = updateSet + ", ";
				}
			}
			
			//loop through to create the sql insert statement (using placeholder ? values to be changed in PreparedStatement)
			for (int i = 0; i < addNamesOriginal.size(); i++) {
							
				columnName =  addNamesOriginal.get(i);
				
				updateWhere = updateWhere + columnName + " = ? ";
					
				if ( i < (addNamesOriginal.size() - 1) ) {
					updateWhere = updateWhere + " AND ";
				}
			}
			
			updateWhere = updateWhere + ";";
			
			///// end insert building //////
			
			//System.out.println("Insert Attempted: " + updateTable + updateSet + updateWhere);
			
            //attempt to connect to the database
			Context ctx = new InitialContext();
			
			//if(ctx == null )
			//	throw new Exception("Boom - No Context");
    
            // /jdbc/postgres is the name of the resource above 
            DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/postgres");
        
		
			if (ds != null) //datasourse exists
			{
				
				try ( Connection conn = ds.getConnection() ) { // try-with-resource : auto closes database connection normally and with errors
								
					if(conn != null) 
					{		
						//Use a prepared statement: avoids injection issues and escape characters
						PreparedStatement stmt = conn.prepareStatement( updateTable + updateSet + updateWhere ); 
						
						//Loop through prepared statement and replace values where appropriate
						for (int i = 0; i < addNamesUpdated.size(); i++ ) {
							
							//Placeholder assignment
							columnName =  addNamesUpdated.get(i);
							value = updated.get(columnName).getAsString();
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
						
						//Loop through prepared statement and replace values where appropriate
						for (int i = 0; i < addNamesOriginal.size(); i++ ) {
							
							//Placeholder assignment
							columnName =  addNamesOriginal.get(i);
							value = original.get(columnName).getAsString();
							dataType = types.get(columnName).getAsString();
							
							//Handle different data types
							switch( dataType ) {
								case "String" :
									stmt.setString(prepIndex, value);
									break;
									
								case "Boolean" :
									if ( ( value ).equals("t") ) {
										stmt.setBoolean(prepIndex, true);
									} else {
										stmt.setBoolean(prepIndex, false);
									}								
									break;
									
								case "Integer" :
									stmt.setInt(prepIndex, Integer.parseInt(value));
									break;
									
								case "TimeStamp":
									Timestamp timeStamp = Timestamp.valueOf(value);
									stmt.setTimestamp(prepIndex, timeStamp);
									break;
							}
							
							prepIndex++;
						}
						
						stmt.executeUpdate();
													
						JsonObject errorObject = new JsonObject();
						
						errorObject.addProperty("Success", true);
						
						PrintWriter out = response.getWriter();
						String jsonString = new Gson().toJson(errorObject);
						
						out.println(jsonString);
						
					}
				} catch (Exception e1) {
					
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
        catch(Exception e) //error handling
        {
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