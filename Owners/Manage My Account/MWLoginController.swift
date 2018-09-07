//
//  MWLoginController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseAuth

class MWLoginController: UIViewController {
    
    @IBOutlet weak var emailLogin: UITextField!
    @IBOutlet weak var passwordLogin: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        if let user = Auth.auth().currentUser {
            self.performSegue(withIdentifier: "OwnerProfile", sender: self)
        }
    }

    @IBAction func signIn(_ sender: Any) {
        guard let email = emailLogin.text else {return}
        guard let password = passwordLogin.text else {return}
        
        
        Auth.auth().signIn(withEmail: email, password: password) {user, error in
        
        if error == nil && user != nil {
            self.dismiss(animated: false, completion: nil)
            }
        }
    }
    
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    

