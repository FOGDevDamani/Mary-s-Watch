//
//  OwnerTeamController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit


class OwnerTeamController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var assignOwnerTeamMember: UITextField!
    @IBOutlet weak var ownerTeamMemberFirstName: UITextField!
    @IBOutlet weak var ownerTeamMemberLastName: UITextField!
    @IBOutlet weak var ownerTeamMemberEmail: UITextField!
    @IBOutlet weak var ownerTeamMemberAddress: UITextField!
    @IBOutlet weak var ownerTeamMemberState: UITextField!
    @IBOutlet weak var ownerTeamMemberCity: UITextField!
    @IBOutlet weak var ownerTeamMemberZipcode: UITextField!
    @IBOutlet weak var ownerTeamMemberCellPhone: UITextField!
    
    
    
   

    override func viewDidLoad() {
        super.viewDidLoad()
        
        

        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    
    
    @IBAction func addTeamMemberSettings(_ sender: Any) {
        storeData()
    }
    
    
    
    
    
    
    func storeData() {
        
    }


}
