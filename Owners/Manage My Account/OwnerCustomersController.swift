//
//  OwnerCustomersController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit


class OwnerCustomersController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var ownerCustomerFirstName: UITextField!
    @IBOutlet weak var ownerCustomerLastName: UITextField!
    @IBOutlet weak var ownerCustomerEmail: UITextField!
    @IBOutlet weak var ownerCustomerAddress: UITextField!
    @IBOutlet weak var ownerCustomerState: UITextField!
    @IBOutlet weak var ownerCustomerCity: UITextField!
    @IBOutlet weak var ownerCustomerZipcode: UITextField!
    @IBOutlet weak var ownerCustomerCounty: UITextField!
    @IBOutlet weak var ownerCustomerCellPhone: UITextField!
    

    override func viewDidLoad() {
        super.viewDidLoad()

       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    
    @IBAction func addCustomerSettings(_ sender: Any) {
        storeData()
    }
    
    
    
    func storeData() {
       
        
    }
    
    
    

   
    

}
