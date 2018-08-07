//
//  CompanyDetailsController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit


class CompanyDetailsController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var typeOfCompany: UITextField!
    @IBOutlet weak var companyName: UITextField!
    @IBOutlet weak var companyAddress: UITextField!
    @IBOutlet weak var companyState: UITextField!
    @IBOutlet weak var companyCity: UITextField!
    @IBOutlet weak var companyZipcode: UITextField!
    @IBOutlet weak var companyWebsite: UITextField!
    @IBOutlet weak var businessPhone: UITextField!
    @IBOutlet weak var EIN: UITextField!
    @IBOutlet weak var numberOfEmployees: UITextField!
    
    
    
    
    
   
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    @IBAction func submitCompanyDetails(_ sender: Any) {
        storeData()
    }
    
    
    

    func storeData() {
    }
    

}
