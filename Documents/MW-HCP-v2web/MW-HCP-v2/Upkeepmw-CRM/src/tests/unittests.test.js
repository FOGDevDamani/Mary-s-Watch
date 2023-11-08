
const User = {
	name: "Damani",
	perspective: "Renter"
}

test("Damani is a Renter", () => {
	expect(User.perspective).toBe("Renter")
})