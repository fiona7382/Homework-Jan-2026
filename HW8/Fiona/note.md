## 1. What is Jest?
    Jest is a JavaScript testing framework that’s commonly used with React.
    It’s all-in-one—it handles test running, assertions, and mocking without extra setup.
    I usually use it to test React components, utility functions, and hooks, and it gives fast feedback during development.

## 2. What is a test case in Jest?
    A test case is the smallest unit of testing.
    In Jest, we usually define it using the test() or it() function, and each test case focuses on one specific behavior 
    of the code. For example, if I’m testing a button, one test case might check whether the onClick handler fires, 
    while another test case checks if the button is disabled during a loading state. We usually group related test cases 
    inside a describe block to form a test suite, which keeps the tests organized and easier to read.

## 3. What does expect do in Jest?
    expect creates an assertion to check a result.
    You pass a value into expect, and then combine it with matchers like toBe or toEqual to verify the output.
    It’s basically like saying, “I expect this value to be 10.” If the expectation isn’t met, the test fails and Jest 
    clearly tells you what went wrong.

## 4. What is the difference between .toBe() and .toEqual() ?
    .toBe() checks if two values are exactly the same. It uses strict equality, so it works best when identity matters, 
    like booleans, numbers, or strings.
    .toEqual() checks whether two values have the same content. It does a deep comparison of the structure instead of 
    the memory reference, so it’s more suitable for objects and arrays.

## 5. How do you test if a react component renders correctly?
    I usually use React Testing Library together with Jest.
    I use render()  to render the component into a virtual DOM, and then query elements with screen, like getByText or 
    getByRole. I focus on what the user actually sees. For example, if I’m testing a header, I’ll assert that an <h1> 
    with the correct title is present in the document.

## 6. How do you simulate a button click in a test?
    I usually grab the button using screen.getByRole('button'), then call await user.click(button). After that, I assert 
    whether a mock function was called or if the UI updated as expected. The best way is to use the user-event library, 
    which is built on top of React Testing Library. It’s better than fireEvent because it simulates real user interactions.

## 7. How do you mock a function with Jest?
    I use jest.fn() for simple callbacks and jest.mock() to intercept entire modules like Axios, allowing me to simulate
    specific return values or errors. To keep tests reliable, I always use jest.clearAllMocks() in a beforeEach block to
    prevent call counts from leaking between test cases.

## 8. What is snapshot test and how do you utilize it?
    Snapshot testing records a component's rendered output as a "reference" file to detect unintended UI changes over 
    time. You utilize it by calling expect(wrapper).toMatchSnapshot(), which compares the current render against the 
    stored version and fails the test if any HTML or style differences are found. 