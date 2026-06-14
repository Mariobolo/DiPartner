package com.dipartner.desktop.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.HashMap;
import java.util.Map;

public class WallpaperSettingsDatabaseHelper extends SQLiteOpenHelper {
    private static final String TAG = "WallpaperSettingsDB";
    private static final String DATABASE_NAME = "wallpaper_settings.db";
    private static final int DATABASE_VERSION = 5;
    
    public static final String TABLE_SETTINGS = "settings";
    
    public static final String COLUMN_ID = "_id";
    public static final String COLUMN_WALLPAPER_CAROUSEL = "wallpaper_carousel";
    public static final String COLUMN_WALLPAPER_MODE = "wallpaper_mode";
    public static final String COLUMN_LOCAL_WALLPAPER_PATH = "local_wallpaper_path";
    public static final String COLUMN_SWITCH_INTERVAL = "switch_interval";
    public static final String COLUMN_BYD_AUTO_START = "byd_auto_start";
    public static final String COLUMN_BOOT_GREETING = "boot_greeting";
    public static final String COLUMN_RANDOM_MODE = "random_mode";
    public static final String COLUMN_SPECIFIED_MODE = "specified_mode";
    
    private static final String CREATE_TABLE_SETTINGS = 
            "CREATE TABLE " + TABLE_SETTINGS + " (" +
            COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
            COLUMN_WALLPAPER_CAROUSEL + " INTEGER NOT NULL DEFAULT 1, " +
            COLUMN_WALLPAPER_MODE + " TEXT NOT NULL DEFAULT 'local', " +
            COLUMN_LOCAL_WALLPAPER_PATH + " TEXT NOT NULL DEFAULT 'dipartner/wallpaper', " +
            COLUMN_SWITCH_INTERVAL + " INTEGER NOT NULL DEFAULT 15000, " +
            COLUMN_BYD_AUTO_START + " INTEGER NOT NULL DEFAULT 0, " +
            COLUMN_BOOT_GREETING + " INTEGER NOT NULL DEFAULT 0, " +
            COLUMN_RANDOM_MODE + " INTEGER NOT NULL DEFAULT 1, " +
            COLUMN_SPECIFIED_MODE + " INTEGER NOT NULL DEFAULT 0);";
    
    private static WallpaperSettingsDatabaseHelper instance;
    
    private WallpaperSettingsDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    
    public static synchronized WallpaperSettingsDatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = new WallpaperSettingsDatabaseHelper(context.getApplicationContext());
        }
        return instance;
    }
    
    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE_SETTINGS);
        Log.d(TAG, "壁纸设置数据库表创建成功");
        
        ContentValues values = new ContentValues();
        values.put(COLUMN_WALLPAPER_CAROUSEL, 1);
        values.put(COLUMN_WALLPAPER_MODE, "local");
        values.put(COLUMN_LOCAL_WALLPAPER_PATH, "dipartner/wallpaper");
        values.put(COLUMN_SWITCH_INTERVAL, 15000);
        values.put(COLUMN_BYD_AUTO_START, 0);
        values.put(COLUMN_BOOT_GREETING, 0);
        values.put(COLUMN_RANDOM_MODE, 1);
        values.put(COLUMN_SPECIFIED_MODE, 0);
        db.insert(TABLE_SETTINGS, null, values);
    }
    
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (oldVersion < 2) {
            db.execSQL("ALTER TABLE " + TABLE_SETTINGS + " ADD COLUMN " + COLUMN_WALLPAPER_MODE + " TEXT NOT NULL DEFAULT 'local'");
        }
        if (oldVersion < 3) {
            db.execSQL("ALTER TABLE " + TABLE_SETTINGS + " ADD COLUMN " + COLUMN_LOCAL_WALLPAPER_PATH + " TEXT NOT NULL DEFAULT 'dipartner/wallpaper'");
        }
        if (oldVersion < 4) {
            db.execSQL("ALTER TABLE " + TABLE_SETTINGS + " ADD COLUMN " + COLUMN_BYD_AUTO_START + " INTEGER NOT NULL DEFAULT 0");
            db.execSQL("ALTER TABLE " + TABLE_SETTINGS + " ADD COLUMN " + COLUMN_BOOT_GREETING + " INTEGER NOT NULL DEFAULT 0");
        }
        if (oldVersion < 5) {
            db.execSQL("ALTER TABLE " + TABLE_SETTINGS + " ADD COLUMN " + COLUMN_RANDOM_MODE + " INTEGER NOT NULL DEFAULT 1");
            db.execSQL("ALTER TABLE " + TABLE_SETTINGS + " ADD COLUMN " + COLUMN_SPECIFIED_MODE + " INTEGER NOT NULL DEFAULT 0");
        }
    }
    
    public Map<String, Object> getAllSettings() {
        Map<String, Object> settings = new HashMap<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_SETTINGS, null, null, null, null, null, null);
        
        if (cursor.moveToFirst()) {
            settings.put("wallpaper_carousel", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_WALLPAPER_CAROUSEL)) == 1);
            settings.put("wallpaper_mode", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_WALLPAPER_MODE)));
            settings.put("local_wallpaper_path", cursor.getString(cursor.getColumnIndexOrThrow(COLUMN_LOCAL_WALLPAPER_PATH)));
            settings.put("switch_interval", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_SWITCH_INTERVAL)));
            settings.put("byd_auto_start", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_BYD_AUTO_START)) == 1);
            settings.put("boot_greeting", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_BOOT_GREETING)) == 1);
            settings.put("random_mode", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_RANDOM_MODE)) == 1);
            settings.put("specified_mode", cursor.getInt(cursor.getColumnIndexOrThrow(COLUMN_SPECIFIED_MODE)) == 1);
        } else {
            settings.put("wallpaper_carousel", true);
            settings.put("wallpaper_mode", "local");
            settings.put("local_wallpaper_path", "dipartner/wallpaper");
            settings.put("switch_interval", 15000);
            settings.put("byd_auto_start", false);
            settings.put("boot_greeting", false);
            settings.put("random_mode", true);
            settings.put("specified_mode", false);
        }
        
        cursor.close();
        db.close();
        return settings;
    }
    
    public void updateWallpaperCarousel(boolean enabled) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_WALLPAPER_CAROUSEL, enabled ? 1 : 0);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新壁纸轮播设置: " + enabled);
    }
    
    public void updateWallpaperMode(String mode) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_WALLPAPER_MODE, mode);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新壁纸模式: " + mode);
    }
    
    public void updateLocalWallpaperPath(String path) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_LOCAL_WALLPAPER_PATH, path);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新本地壁纸路径: " + path);
    }
    
    public void updateSwitchInterval(int interval) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_SWITCH_INTERVAL, interval);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新壁纸轮播时间间隔: " + interval);
    }
    
    public void updateBydAutoStart(boolean enabled) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_BYD_AUTO_START, enabled ? 1 : 0);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新原桌面自启设置: " + enabled);
    }
    
    public void updateBootGreeting(boolean enabled) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_BOOT_GREETING, enabled ? 1 : 0);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新开机问候语设置: " + enabled);
    }
    
    public void updateRandomMode(boolean enabled) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_RANDOM_MODE, enabled ? 1 : 0);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新随机模式设置: " + enabled);
    }
    
    public void updateSpecifiedMode(boolean enabled) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_SPECIFIED_MODE, enabled ? 1 : 0);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "更新指定模式设置: " + enabled);
    }
    
    public void saveSettings(boolean carousel, String mode, String path, int interval) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_WALLPAPER_CAROUSEL, carousel ? 1 : 0);
        values.put(COLUMN_WALLPAPER_MODE, mode);
        values.put(COLUMN_LOCAL_WALLPAPER_PATH, path);
        values.put(COLUMN_SWITCH_INTERVAL, interval);
        db.update(TABLE_SETTINGS, values, null, null);
        db.close();
        Log.d(TAG, "保存壁纸设置: carousel=" + carousel + ", mode=" + mode + ", path=" + path + ", interval=" + interval);
    }
}