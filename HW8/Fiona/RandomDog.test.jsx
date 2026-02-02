import { render, screen, waitFor } from "@testing-library/react";
import RandomDogImageFetch from "./RandomDog";
import userEvent from "@testing-library/user-event";


//mock fetch before each test,return same image url
const imgUrl = "https://images.dog.ceo/breeds/pinscher-miniature/mvc-006f.jpg"
beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    message: imgUrl,
                }),
        })
    );
});



// test 1 - the display of title
test("renders Random Dog title", async () => {
    render(<RandomDogImageFetch />);
    // wait for the initial fetch + state updates to finish (prevents act warning)
    await screen.findByRole("img");
    expect(screen.getByText(/Random Dog Image Fetch/i)).toBeInTheDocument();
});



//test 2 - the display of button
test("renders Get Another Dog button", async () => {
    render(<RandomDogImageFetch />);
    // wait for the initial fetch + state updates to finish (prevents act warning)
    await screen.findByRole("img");
    expect(
        screen.getByRole("button", { name: /get another dog/i })
    ).toBeInTheDocument();
});


//test 3 - useEffect and fetch only once on mount
test("calls fetch on mount", async () => {
    render(<RandomDogImageFetch />);
    // wait until the component finishes updating after fetch (prevents act warning)
    await screen.findByRole("img");
    expect(global.fetch).toHaveBeenCalledTimes(1);
});

//test 4 - display image after fetch, look for the render of img element
test("renders dog image after fetch success", async () => {
    render(<RandomDogImageFetch />);
    const image = await screen.findByRole("img");
    expect(image).toHaveAttribute("src", imgUrl);
});

//test 5 - fetch call after click the button
test("calls fetch again after clicking the button", async () => {
    render(<RandomDogImageFetch />);

    // 1) initial fetch by useEffect after mount
    await screen.findByRole("img");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // 2) look for button and click
    const user = userEvent.setup();
    const btn = screen.getByRole("button", { name: /get another dog/i });
    await user.click(btn);

    // 3) mock fetch after clicking button
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
    await screen.findByRole("img");
});

// test 6 - show loading and disable button during fetch
test("shows Loading... and disables button while fetching", async () => {
    // 1. Make fetch pending to see loading state
    let resolveFetch;
    global.fetch.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                resolveFetch = resolve;
            })
    );

    render(<RandomDogImageFetch />);

    // 2. display loading UI
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();

    // 3. button disabled during loading
    const btn = screen.getByRole("button", { name: /get another dog/i });
    expect(btn).toBeDisabled();

    // 4. Close the pending fetch
    resolveFetch({
        ok: true,
        json: async () => ({ message: imgUrl }),
    });

    // 5. loading disappear and image display
    const image = await screen.findByRole("img");
    expect(image).toHaveAttribute("src", imgUrl);
    await waitFor(() => expect(btn).not.toBeDisabled());
});


// test 7 - handle server error: res.ok = false -> shows error message
test("shows error message when response is not ok", async () => {
    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: false,
            json: async () => ({ message: "ignored" }),
        })
    );

    render(<RandomDogImageFetch />);

    // error message appear
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/request fail/i);

    // no image when error message show
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

// test 9 - show error message after rando failure
test("shows generic error message when thrown value is not an Error object", async () => {
    global.fetch.mockImplementationOnce(() =>
        Promise.reject("some random failure")
    );

    render(<RandomDogImageFetch />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/oops! something went wrong!/i);
});
