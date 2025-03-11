package com.Adapter.icare.Utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PrintOutHelper {

    public static void print(Object obj) {
		ObjectMapper mapper = new ObjectMapper();
		String className = "";
		if (obj == null) {
			className = "You've passed null object";
		} else {
			className = obj.getClass().getSimpleName();
		}
		System.out.println("--------------------------" + className
				+ "----------------------------------------------------------");
		try {
			System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj));
		} catch (JsonProcessingException e) {
			System.out.println("########################ERROR########################");
			e.printStackTrace();
		}
		System.out.println(
				"-----------------------------------------------------------------------------------------------------");
	}
}
