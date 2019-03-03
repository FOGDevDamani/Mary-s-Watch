//
//  LandingPageController.swift
//  maryswatch
//
//  Created by Damani Turner on 5/15/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class LandingPageController: UIViewController {
  
  override func viewDidLoad() {
    super.viewDidLoad()
    if Auth.auth().currentUser == nil {
      let storyBoard = UIStoryboard(name: "Main", bundle: nil)
      let popUp = storyBoard.instantiateViewController(withIdentifier: "UserAlertController")
      self.present(popUp, animated: true, completion: nil)
    } else {
      let storyBoard = UIStoryboard(name: "Main", bundle: nil)
      let showLogin = storyBoard.instantiateViewController(withIdentifier: "SPLoginController")
      self.present(showLogin, animated: true, completion: nil)
    }
  }
  
}
