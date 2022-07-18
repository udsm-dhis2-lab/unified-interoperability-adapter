package com.Adapter.icare;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IcareApplicationTests {

	@Test
	void AddTwoNumbers() {
		Calculator cl = new Calculator();
		//given
		int a = 10;
		int b = 20;

		//implementations
		int result = cl.addNumbers(a, b);

		int expected = 30;
		assertEquals(expected,result);


	}

}

class Calculator{

	int addNumbers(int a, int b){

		return a + b;
	}
}
