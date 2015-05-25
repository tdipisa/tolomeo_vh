/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.utility;

public class Costanti {

   public static enum OperazioniGeometriche {
      
      CANCELLAZIONE_RECORD('R',"Cancellazione di un record"),
      NUOVO_POLIGONO('N',"Inserimento di un poligono"),
      AGGIUNTA_AL_POLIGONO('O',"Aggiunta di un'area ad un poligono"),
      CANCELLAZIONE_PARZIALE_POLIGONO('D',"Cancellazione parziale di un poliogno"),
      TRASFERIMENTO_AREE_TRA_POLIGONI('M',"Passaggio di un'area da unpoligono ad un altro"),
      SCRITTURA_PUNTO('P',"Inserimento di un punto");      
      
      OperazioniGeometriche(char codice, String descrizione){
         this.codice = codice;
         this.descrizione = descrizione;
      }
      
      private final char codice;
      private final String descrizione;
      
      final public char getCode() { return codice; }
      final public String getDescrizione() { return descrizione; }
      
      public static OperazioniGeometriche decode(char codice){
         for(OperazioniGeometriche og: OperazioniGeometriche.values()){
            if(og.getCode() == codice)
               return og;
         }
         return null;
      }
      
      public String toString() {         
         return ""+codice;
      }
      
   }
   
   public static enum OperazioniStandard {
      
      VISUALIZZAZIONE("V","Visualizzazione"),
      INSERIMENTO("I","Gestione Inserimento"),
      MODIFICA("M","Gestione Modifica"),
      CANCELLAZIONE("C","Gestione Cancellazione"),
      INSERIMENTO_OK("IOK","Inserimento"),
      MODIFICA_OK("MOK","Modifica"),
      CESSAZIONE("CE","Cancellazione"),            
      RICERCA("R","Ricerca");      
      
      OperazioniStandard(String codice, String descrizione){
         this.codice = codice;
         this.descrizione = descrizione;
      }
      
      private final String codice;
      private final String descrizione;
      
      final public String getCode() { return codice; }
      final public String getDescrizione() { return descrizione; }
      
      public static OperazioniStandard decode(String codice){
         if(codice == null) return null;
         for(OperazioniStandard og: OperazioniStandard.values()){
            if(og.getCode().equals(codice))
               return og;
         }
         return null;
      }
      
      public String toString() {         
         return codice + " : " + descrizione;
      }
      
   }
   
   public static enum Circoscrizioni {
       
       _TUTTE_("T","- Tutte -"),
       NORD("N1","Nord"),
       EST("E2","Est"),
       SUD("S3","Sud"),       
       OVEST("O4","Ovest"),       
       CENTRO("C5","Centro");      
       
       Circoscrizioni(String codice, String descrizione){
          this.codice = codice;
          this.descrizione = descrizione;
       }
       
       private final String codice;
       private final String descrizione;
       
       final public String getCode() { return codice; }
       final public String getDescrizione() { return descrizione; }
       
       public static Circoscrizioni decode(String codice){
          if(codice == null) return null;
          for(Circoscrizioni og: Circoscrizioni.values()){
             if(og.getCode().equals(codice))
                return og;
          }
          return null;
       }
       
       public String toString() {         
          return codice + " : " + descrizione;
       }
       
    }
    
   public Costanti() {
      super();
      // TODO Auto-generated constructor stub
   }
   
   public static void main(String[] args){
      System.out.print(Costanti.OperazioniGeometriche.decode('O').equals(OperazioniGeometriche.AGGIUNTA_AL_POLIGONO));
   }

}
