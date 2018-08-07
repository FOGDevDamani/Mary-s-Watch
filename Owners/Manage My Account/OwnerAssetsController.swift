//
//  OwnerAssetsController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit


class OwnerAssetsController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var ownerTypeOfProperty: UITextField!
    @IBOutlet weak var ownerPropertyAddress: UITextField!
    @IBOutlet weak var ownerPropertyState: UITextField!
    @IBOutlet weak var ownerPropertyCity: UITextField!
    @IBOutlet weak var ownerPropertyZipcode: UITextField!
    @IBOutlet weak var ownerPropertyCounty: UITextField!
    
    

    override func viewDidLoad() {
        super.viewDidLoad()

        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    
    @IBAction func addPropertySettings(_ sender: Any) {
        storeData()
    }
    
    
    
    
    
    
    
    func storeData() {
     
    }

    

}
