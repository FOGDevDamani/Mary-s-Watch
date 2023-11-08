import { test, beforeEach, describe, expect, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import axios from "axios";
import { useStoreUserInfo } from "../../stores/storeUser";
import { User } from "../../upkeepmw-services/profiles-services/user";

const user = new User();

vi.mock("axios");
vi.mock("vue-router");

describe("Test storage functionc", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
    axios.post.mockReset();
    axios.get.mockReset();
  });

  test("storage function gets hit", async () => {
    const storeUser = useStoreUserInfo();

    // const userData = {
    //   userPerspectives: ['renter', 'owner', 'service_provider'],
    //   companyType: 'llc',
    //   accountType: '[personal, business]',
    //   bio: 'testing this out to see if it works',
    //   phone: '123-456-7890',
    //   licenseNumber: '0987654321',
    //   firstName: 'john',
    //   lastName: 'doe',
    //   address: '123 sesame st',
    //   city: 'sesame city',
    //   state: 'sesame world',
    //   zipcode: '123456',
    //   county: 'sesame county',
    //   username: 'john.doe',
    //   email: 'john.doe@mail.com',
    //   password: 'password',
    //   createdOn: 'now',
    // };

    const userData = user;

    const newUserMock = {
      userData: userData,
    };

    axios.post.mockResolvedValue({
      userData: newUserMock,
    });

    const newUser = await storeUser.addUserOnRegister(userData);

    const userSpy = vi.spyOn(storeUser, "addUserOnRegister");

    storeStorage.addUserOnRegister(newUserMock);

    expect(userSpy).toHaveBeenCalledWith(newUserMock);
  });

 

 
});
