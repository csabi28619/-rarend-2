   M S B A M L   `   `   `  ����  Wpf    Wpf.MainWindow   5   	   W SPresentationCore, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35e aSystem.Windows.Controls.Ribbon, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089R NWindowsBase, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35F 9http://schemas.microsoft.com/winfx/2006/xaml/presentation     5   	   R NSystem.Xaml, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	     � Title$"  Órarend és Teendő-kezelő��5   	   $	��600��6*   $	��900��67   .��5      � $��10q�6    � RowDefinitions 5   
   �� 5      $
��Auto �6   �� 5      $��* �6   �� 5	      $��* �6   �� 5
      $
��Auto �6   .+�5   
   �� $��📅 Órarend��6   $
��Bold"�6&   $��18(�68   $��0,0,0,5q�6F   &   System.Windows.Controls.DataGrid  5   
   -   5          Name$ 	dgOrarend��5      $��1��6&      AutoGenerateColumns$
 True��63   $��0,0,0,10q�6N   �� 5   
   $��📝 Teendők��6   $
��Bold"�6&   $��18(�68   $��2��6F   $��0,10,0,5q�6S     5   
   -   5        $ 	dgTeendok��5      $��2��6&   $
 True��63   $��	0,30,0,10q�6N   �� 5   
   $��3��6    �� Orientation$ 
Horizontal=�6"   $��Center=�6;   $��0,10,0,0q�6X   .+�5      �� -   5        $��➕ Órarend hozzáadása��5      $��5q�6Q   �� 5      -   5        $��➕ Teendő hozzáadása��5      $��5q�6O   �� 5      -   5        $��💾 Mentés��5      $��5q�6>   �� 5      -   5        $��📂 Betöltés��5      $��5q�6B   5      5      5      