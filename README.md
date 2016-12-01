# Malgrabber-for-CKEditor
Bu plugin ile MyAnimeList sitesinden herhangi bir anime veya manganın bilgilerini çekebilirsiniz.

## Ayarlar
#### Çerez Ayarları
**cookie_settings.php** dosyasını açın.

```php
$config["cookie_limit"] = "15";
```
Maksimum kullanma limiti. Bu limiti aşınca belirtilen süre kadar beklemek zorunda kalırsınız.

```php
$cookie_hours = 2;
```
Maksimum kullanma limiti aşıldıktan sonra beklenilen saat.

```php
$cookie_mins = 0;
```
Maksimum kullanma limiti aşıldıktan sonra beklenilen dakika.

#### Afiş Yükleme Ayarları
**image_settings.php** dosyasını açın.

```php
$config["image_save_path"] = "poster/";
```
Afişlerin kaydedileceği dizin.

```php
$config["image_max_size"] = "400";
```
Yüklenilen afişlerin en ve boy oranları için sınır değeri.

# In English
With this plugin, you can get information of any anime or manga from MyAnimeList website.

## Settings
#### Cookie Settings
Open **cookie_settings.php** file.

```php
$config["cookie_limit"] = "15";
```
Maximum usage limit. If you exceed this limit, you will have to wait for the specified time.

```php
$cookie_hours = 2;
```
Expected hour(s) after exceeding the maximum usage limit.

```php
$cookie_mins = 0;
```
Expected min(s) after exceeding the maximum usage limit.

#### Poster Upload Settings
Open **image_settings.php** file.

```php
$config["image_save_path"] = "poster/";
```
The directory where the images will be saved.

```php
$config["image_max_size"] = "400";
```
Limit value for the width and height of the uploaded images.
